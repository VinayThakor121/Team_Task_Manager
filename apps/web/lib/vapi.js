import Vapi from "@vapi-ai/web";

let instance;

export const getVapi = () => {
  if (!instance) {
    instance = new Vapi(process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN || "");
  }
  return instance;
};
