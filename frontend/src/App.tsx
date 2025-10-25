import React, { useState } from "react";
import {
  showConnect,
  UserSession,
  AppConfig
} from "@stacks/connect";
import {
  callRegisterCharity,
  callCreateCampaign,
  callDonate,
  callSubmitProof,
  callRelease,
  callRefund
} from "./api";

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });

export default function App() {
  const [addr, setAddr] = useState<string>("");

  const connect = () =>
    showConnect({
      userSession,
      appDetails: { name: "Transparent Philanthropy Chain", icon: window.location.origin + "/favicon.ico" },
      onFinish: () => {
        const userData = userSession.loadUserData();
        setAddr(userData.profile.stxAddress.testnet);
      },
    });

  return (
    <div style={{ fontFamily: "system-ui", maxWidth: 900, margin: "40px auto" }}>
      <h1>Transparent Philanthropy Chain</h1>
      <p>Simple demo UI for charity registration, campaigns, donations, proofs and release.</p>

      <button onClick={connect}>
        {addr ? `Connected: ${addr}` : "Connect Wallet"}
      </button>

      <hr />

      <section>
        <h2>Register Charity</h2>
        <Form
          fields={[{name:"name"},{name:"info"}]}
          onSubmit={({name, info}) => callRegisterCharity(name, info)}
        />
      </section>

      <section>
        <h2>Create Campaign</h2>
        <Form
          fields={[
            {name:"goalUstx",placeholder:"e.g. 1000000 (1 STX)"},
            {name:"deadlineBBH",placeholder:"e.g. current burn block + 100"},
            {name:"description"},
            {name:"verifier",placeholder:"STX principal"},
          ]}
          onSubmit={({goalUstx, deadlineBBH, description, verifier}) =>
            callCreateCampaign(BigInt(goalUstx), BigInt(deadlineBBH), description, verifier)
          }
        />
      </section>

      <section>
        <h2>Donate</h2>
        <Form
          fields={[{name:"id"},{name:"ustx",placeholder:"amount in uSTX"}]}
          onSubmit={({id, ustx}) => callDonate(BigInt(id), BigInt(ustx))}
        />
        <p style={{fontSize:12,opacity:0.7}}>
          Note: Some wallets may not pass the STX amount to payable contracts from dapps.
          If the donation amount does not go through, use Stacks Explorer to invoke <code>donate(id)</code> with the desired amount.
        </p>
      </section>

      <section>
        <h2>Submit Proof</h2>
        <Form
          fields={[{name:"id"},{name:"hash",placeholder:"IPFS hash"}]}
          onSubmit={({id, hash}) => callSubmitProof(BigInt(id), hash)}
        />
      </section>

      <section>
        <h2>Release Funds (Verifier)</h2>
        <Form
          fields={[{name:"id"}]}
          onSubmit={({id}) => callRelease(BigInt(id))}
        />
      </section>

      <section>
        <h2>Refund (Donor)</h2>
        <Form
          fields={[{name:"id"}]}
          onSubmit={({id}) => callRefund(BigInt(id))}
        />
      </section>
    </div>
  );
}

function Form({fields, onSubmit}:{fields:{name:string;placeholder?:string}[], onSubmit:(v:any)=>any}) {
  const [state, setState] = useState<Record<string,string>>({});
  return (
    <form
      onSubmit={(e)=>{e.preventDefault(); onSubmit(state)}}
      style={{display:"grid", gap:8, marginBottom:24}}
    >
      {fields.map(f=>(
        <input key={f.name} placeholder={f.placeholder ?? f.name}
          value={state[f.name] ?? ""} onChange={(e)=>setState({...state,[f.name]:e.target.value})}/>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
}
