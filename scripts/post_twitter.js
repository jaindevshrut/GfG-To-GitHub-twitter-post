
import { OpenAIToolSet } from "composio-core";
import { z } from "zod";

const toolSet = new OpenAIToolSet();

const action = await toolSet.createAction({
  actionName: "my_custom_action",
  toolName: "twitter",
  description: "This describes my custom action",
  inputParams: z.object({
    param1: z.string().describe("This is a required string parameter"),
    param2: z.string().describe("This is a required string parameter"),
  }),
  callback: async (inputParams, authCredentials, executeRequest) => {
    try {
      const res = await executeRequest({
        endpoint: "/my_endpoint",
        method: "PUT",
        body: {},
        parameters: [], // [{ "in": "query", "name": "page", "value": "1" }]
      });
      return res;
    } catch (e) {
      console.error(e);
      return {};
    }
  },
  // you can also use authCredentials to locally use the auth token
})





import { OpenAIToolSet } from "composio-core";

const userId = "user@example.com";
const appName = "twitter";
const authScheme = "OAUTH2";

const toolset = new OpenAIToolSet();

const connectionRequest = await toolset.client.connectedAccounts.initiate({
    appName: appName, 
    redirect_url: 'https://yourwebsite.com/callback/success', // user comes here after oauth flow
    entityId: userId,
    authMode: authScheme,
    authConfig: {},
});

console.log(connectionRequest.connectedAccountId, connectionRequest.connectionStatus);


// Redirect user to the redirect url so they complete the oauth flow
console.log(connectionRequest.redirectUrl)
