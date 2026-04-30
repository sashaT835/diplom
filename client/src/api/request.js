import api from "./axios";

export const sendToRequest = async (requestPayload, serviceName) => {
    const response = await api.post("/requests", {
        ...requestPayload,
        serviceName,
    });
    return response.data;
};
