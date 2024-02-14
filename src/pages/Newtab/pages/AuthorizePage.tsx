import '@atlaskit/css-reset'
import { Code } from '@atlaskit/code'
import Heading from '@atlaskit/heading'
import Form, { Field, FormFooter, FormHeader } from "@atlaskit/form"
import { Box } from '@atlaskit/primitives'
import Select, {ValueType} from '@atlaskit/select'
import TextField from '@atlaskit/textfield'
import React, {useState} from "react"
import Button from "@atlaskit/button"

import "./CodeBox_module.css"

type FormProps = { "clientId": String, "scopes": Option[], "redirectUri": String, "responseType": String,
    "state": String, "audience": String }
type Option = {label: string, value: string}

const AuthorizePage = () => {
    const [savedValues, setSavedValues] = useState<FormProps | null>(null)
    return <div>
        <Heading level={"h900"}>Authorize</Heading>
        <p>
            The first step is to go through the authorization flow.

        </p>
        <div style={{ textAlign: "left" }}>
            <Form<FormProps>
                onSubmit={(values) => {
                    setSavedValues(values)
                }
            }>
                {({ formProps }) =>
                    <form {...formProps}><Box padding={"space.250"}>
                        <FormHeader>
                            Most of the values here can be found from the developer console
                            at <a href={"https://developer.atlassian.com"}>developer.atlassian.com</a>
                            &gt; Console &gt; My apps &gt; App Name
                        </FormHeader>
                        <Field
                            name={"clientId"}
                            label={"Client Id"}
                            isRequired
                        >
                            {({ fieldProps, }) => <TextField {...fieldProps} />}
                        </Field>
                        The client id is available from the developer console &gt; Settings &gt; Client ID.

                        <Field<ValueType<Option, true>>
                            name={"scopes"}
                            label={"Scopes"}
                            isRequired
                            defaultValue={["read:me", "offline_access"].map(v => ({label: v, value: v}))}
                        >
                            {({ fieldProps: {id, ...rest} }) => <Select
                                {...rest}
                                inputId={id}
                                isMulti
                                options={["read:me", "offline_access"].map(v => ({label: v, value: v}))}
                            />}
                        </Field>
                        These scopes must be enabled for your client in the console &gt; Permissions.

                        <Field
                            name={"redirectUri"}
                            label={"Redirect URI"}
                            isRequired
                            defaultValue={window.location.origin}
                            isDisabled
                        >
                            {({ fieldProps }) => <TextField {...fieldProps} />}
                        </Field>
                        This redirect uri value must match the value set in the console &gt; Authorization &gt; Callback URL

                        <Field
                            name={"responseType"}
                            label={"Redirect Type"}
                            isRequired
                            defaultValue={"code"}
                            isDisabled
                        >
                            {({ fieldProps }) => <TextField {...fieldProps} />}
                        </Field>
                        This MUST be set to <Code>code</Code>

                        <Field
                            name={"state"}
                            label={"State"}
                            isRequired
                            defaultValue={"1234"}
                        >
                            {({ fieldProps }) => <TextField {...fieldProps} />}
                        </Field>
                        This is the state value - it should be returned in the redirect-to-app stage of the flow.
                        It is highly recommended to randomise it and use it as a key to match and validate when
                        obtaining the authorization code.

                        <Field
                            name={"prompt"}
                            label={"Prompt"}
                            isRequired
                            defaultValue={"consent"}
                            isDisabled
                        >
                            {({ fieldProps }) => <TextField {...fieldProps} />}
                        </Field>
                        Can only be <Code>consent</Code>.

                        <FormFooter>
                            <Button appearance={"primary"} type={"submit"}>Generate Link</Button>
                        </FormFooter>

                    </Box></form>
                }
            </Form>
            { savedValues && <Box padding={"space.250"}><div style={{textAlign: "left"}}>
                <p></p>
                Go to the link below to be sent to the consent screen.
                <p></p>
                <a href={(Object.values(savedValues).filter(v => v == null).length == 0)? "https://auth.atlassian.com/authorize?"
                    + "client_id=" + savedValues.clientId
                    + "&scope=" + savedValues.scopes.map(v => v.value).join(" ")
                    + "&redirect_uri=" + savedValues.redirectUri + "/newtab.html"
                    + "&response_type=" + savedValues.responseType
                    + "&state=" + savedValues.state
                    + "&prompt=consent": undefined}><code className="codeBlock">
                    https://auth.atlassian.com/authorize?<br/>
                    client_id={ savedValues.clientId }<br/>
                    &scope={ savedValues.scopes.map(v => v.value).join(" ") }<br/>
                    &redirect_uri={ savedValues.redirectUri + "/newtab.html"}<br/>
                    &response_type={ savedValues.responseType }<br/>
                    &state={ savedValues.state }<br/>
                </code></a>
            </div></Box>}
        </div>
    </div>
}

export default AuthorizePage
