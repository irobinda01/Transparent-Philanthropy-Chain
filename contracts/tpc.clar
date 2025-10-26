;; Transparent Philanthropy Chain (TPC)
;; Milestone-based donation escrow with proof + verifier release and donor refunds.
;; SPDX-License-Identifier: MIT

(define-data-var next-campaign-id uint u1)

(define-constant ERR-NOT-CHARITY (err u100))
(define-constant ERR-NOT-VERIFIER (err u101))
(define-constant ERR-CAMPAIGN-NOT-FOUND (err u102))
(define-constant ERR-NOT-ACTIVE (err u103))
(define-constant ERR-ALREADY-RELEASED (err u104))
(define-constant ERR-DEADLINE-NOT-PASSED (err u105))
(define-constant ERR-NOTHING-TO-REFUND (err u106))
(define-constant ERR-PROOF-NOT-SUBMITTED (err u107))
(define-constant ERR-ALREADY-REFUNDED (err u108))
(define-constant ERR-INVALID (err u109))

(define-constant STATUS-ACTIVE u1)
(define-constant STATUS-RELEASED u2)
(define-constant STATUS-EXPIRED u3)

;; principals that act as charities
(define-map charities
  { who: principal }
  { name: (string-ascii 64),
    info-hash: (string-ascii 256) })  ;; IPFS hash or URL pointer

;; campaign storage
(define-map campaigns
  { id: uint }
  { charity: principal,
    goal: uint,                 ;; in uSTX
    raised: uint,               ;; in uSTX
    deadline: uint,             ;; burn-block-height when expires
    description: (string-utf8 256),
    verifier: principal,
    status: uint,               ;; STATUS-*
    proof-hash: (optional (string-utf8 256)),
    released: bool })

;; donation amounts by campaign+donor
(define-map donations
  { id: uint, donor: principal }
  { amount: uint,
    refunded: bool })

;; --- READ HELPERS ---

(define-read-only (get-charity (who principal))
  (default-to { name: "", info-hash: "" }
    (map-get? charities { who: who })))

(define-read-only (get-campaign (id uint))
  (ok (map-get? campaigns { id: id })))

(define-read-only (get-donation (id uint) (donor principal))
  (ok (map-get? donations { id: id, donor: donor })))

;; --- ADMIN / REGISTRATION ---

(define-public (register-charity (name (string-ascii 64)) (info (string-ascii 256)))
  (begin
    (map-set charities { who: tx-sender } { name: name, info-hash: info })
    (ok true)))

(define-private (assert-charity (p principal))
  (if (is-some (map-get? charities { who: p }))
    (ok true)
    ERR-NOT-CHARITY))

;; --- CAMPAIGNS ---

(define-public (create-campaign
    (goal uint)
    (deadline uint)
    (description (string-utf8 256))
    (verifier principal))
  (begin
    (asserts! (is-some (map-get? charities { who: tx-sender })) ERR-NOT-CHARITY)
  (asserts! (> goal u0) ERR-INVALID)
    (let
      (
        (id (var-get next-campaign-id))
      )
      (map-set campaigns { id: id }
        { charity: tx-sender,
          goal: goal,
          raised: u0,
          deadline: deadline,
          description: description,
          verifier: verifier,
          status: STATUS-ACTIVE,
          proof-hash: none,
          released: false })
      (var-set next-campaign-id (+ id u1))
      (ok id))))

;; --- DONATIONS ---

(define-public (donate (id uint))
  (let
    (
      (c (map-get? campaigns { id: id }))
      (amount (stx-get-balance tx-sender))
    )
    (asserts! (is-some c) ERR-CAMPAIGN-NOT-FOUND)
    (let
      (
        (cv (unwrap! c ERR-CAMPAIGN-NOT-FOUND))
      )
      (asserts! (is-eq (get status cv) STATUS-ACTIVE) ERR-NOT-ACTIVE)
      (asserts! (> amount u0) ERR-INVALID)
      ;; transfer STX to contract for escrow
      (match (stx-transfer? amount tx-sender (as-contract tx-sender))
        success
          (let
            (
              (prev (map-get? donations { id: id, donor: tx-sender }))
              (new-amt (+ (if (is-some prev) (get amount (unwrap! prev (err u999))) u0) amount))
            )
            (map-set donations { id: id, donor: tx-sender } { amount: new-amt, refunded: false })
            (map-set campaigns { id: id }
              (merge cv { raised: (+ (get raised cv) amount) }))
            (ok new-amt))
        error ERR-INVALID))))

;; --- PROOF & RELEASE ---

(define-public (submit-proof (id uint) (proof (string-utf8 256)))
  (let ((c (map-get? campaigns { id: id })))
    (asserts! (is-some c) ERR-CAMPAIGN-NOT-FOUND)
    (let ((cv (unwrap! c ERR-CAMPAIGN-NOT-FOUND)))
      (asserts! (is-eq (get charity cv) tx-sender) ERR-NOT-CHARITY)
      (asserts! (is-eq (get status cv) STATUS-ACTIVE) ERR-NOT-ACTIVE)
      (map-set campaigns { id: id } (merge cv { proof-hash: (some proof) }))
      (ok true))))

(define-public (verify-and-release (id uint))
  (let ((c (map-get? campaigns { id: id })))
    (asserts! (is-some c) ERR-CAMPAIGN-NOT-FOUND)
    (let ((cv (unwrap! c ERR-CAMPAIGN-NOT-FOUND)))
      (asserts! (is-eq (get verifier cv) tx-sender) ERR-NOT-VERIFIER)
      (asserts! (is-eq (get status cv) STATUS-ACTIVE) ERR-NOT-ACTIVE)
      (asserts! (is-some (get proof-hash cv)) ERR-PROOF-NOT-SUBMITTED)
      (asserts! (not (get released cv)) ERR-ALREADY-RELEASED)
      (let ((to (get charity cv)) (amt (get raised cv)))
        (if (> amt u0)
          (match (stx-transfer? amt tx-sender to)
            r (begin
                 (map-set campaigns { id: id } (merge cv { status: STATUS-RELEASED, released: true }))
                 (ok amt))
            e ERR-INVALID)
          (ok u0))))))

;; --- REFUNDS ---

(define-public (refund (id uint))
  (let (
        (c (map-get? campaigns { id: id }))
        (d (map-get? donations { id: id, donor: tx-sender }))
      )
    (asserts! (is-some c) ERR-CAMPAIGN-NOT-FOUND)
    (asserts! (is-some d) ERR-NOTHING-TO-REFUND)
    (let ((cv (unwrap! c ERR-CAMPAIGN-NOT-FOUND))
          (dv (unwrap! d ERR-NOTHING-TO-REFUND)))
      (asserts! (not (get released cv)) ERR-ALREADY-RELEASED)
      (asserts! (>= burn-block-height (get deadline cv)) ERR-DEADLINE-NOT-PASSED)
      (asserts! (not (get refunded dv)) ERR-ALREADY-REFUNDED)
      (let ((amt (get amount dv)))
        (if (> amt u0)
          (match (stx-transfer? amt tx-sender tx-sender)
            r (begin
                 (map-set donations { id: id, donor: tx-sender } (merge dv { refunded: true }))
                 (map-set campaigns { id: id } (merge cv { status: STATUS-EXPIRED }))
                 (ok amt))
            e ERR-INVALID)
          ERR-NOTHING-TO-REFUND)))))

;; --- UTIL ---

(define-read-only (percent-funded (id uint))
  (let ((c (map-get? campaigns { id: id })))
    (if (is-some c)
      (let ((cv (unwrap! c (err u0))))
        (if (> (get goal cv) u0)
          (ok (/ (* (get raised cv) u10000) (get goal cv))) ;; basis points
          (ok u0)))
      ERR-CAMPAIGN-NOT-FOUND)))
