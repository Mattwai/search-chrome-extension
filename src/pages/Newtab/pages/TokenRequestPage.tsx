import SectionMessage from "@atlaskit/section-message";
import Form, {Field, FormFooter} from "@atlaskit/form";
import TextField from "@atlaskit/textfield";
import "./CodeBox_module.css"
import Button from "@atlaskit/button"

import TokenHandler from "../../Background/TokenHandler";
import React, { useContext, useEffect } from 'react';
import { AppContext } from '../AppContext';
import ChromeStorageHandler from "../../Background/ChromeStorageHandler";

type TokenRequestPageProps = {
    code: string
}

const TokenRequestPage = ({code}: TokenRequestPageProps) => {
    const { clientState, setClientState, tokenResponseState, setTokenResponseState } = useContext(AppContext);

    return <div>
        <div style={{textAlign: "left"}}>
            <p></p>
            This can be used alongside your client's id and secret to obtain an Auth Token
            <SectionMessage appearance={"warning"} title={"Server Side Only"}>
                This part of the request should <em>always</em> be done on the server side.
                Do <em>not</em> leak your client secret to a user.
            </SectionMessage>
        </div>
        <Form<{ client_id: String, client_secret: String }> onSubmit={async (values) => {
            if(code === null){
                window.location.search = "";
            }
            else{
                const newClient = {
                    id: values.client_id.toString(),
                    secret: values.client_secret.toString(),
                }
                setClientState(newClient)
                ChromeStorageHandler.SetClientStorage(newClient)
                TokenHandler.generateAccessToken(code, newClient, setTokenResponseState)
            }
        }}>
            {({formProps}) =>
                <form {...formProps} style={{textAlign: "left"}}>
                    <Field name={"client_id"} label={"Client ID"} isRequired>
                        {({fieldProps}) => <TextField {...fieldProps} />}
                    </Field>
                    Should be the same ID as the one used for the authorize call.
                    <Field name={"client_secret"} label={"Client Secret"} isRequired>
                        {({fieldProps}) => <TextField {...fieldProps} />}
                    </Field>
                    The client secret is available from the developer console &gt; Settings &gt; Client Secret.
                    <p></p>
                    <FormFooter>
                        <Button appearance={"primary"} type={"submit"}>Exchange for Token</Button>
                    </FormFooter>
                </form>
            }
        </Form>
        <p></p>
        {
            (tokenResponseState != null && tokenResponseState.access_token != null) && <div>
                Now that we have a token we can use it!<br/>
                <Button appearance="primary" onClick={() => {window.location.search = ""}}>Go to use token page</Button>
            </div>
        }
    </div>
}

export default TokenRequestPage
