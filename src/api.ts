import axios from "axios";

const api = axios.create({
	baseURL: "https://ln9zshn1mb.execute-api.us-east-2.amazonaws.com",
});

api.interceptors.request.use(
    (config) => {
        const siteId = sessionStorage.getItem("siteId");
        if (siteId) {
            config.headers.Authorization = `Site-ID ${siteId}`;
        }

        return config;
    }
);

// api.interceptors.response.use(
// 	(response) => {
// 		// console.log(response.data);
// 		return response;
// 	},
// 	function (error) {
// 		// console.log(error.response.data);
// 		return Promise.reject(error);
// 	}
// );

export default api;

export async function getChatResponse({ message, history }: {
    message: string;
    history?: {
        message: string;
        isUser: boolean;
    }[];
}) {
	try {
		const response = await api.post("/chat", {
            message,
            history,
		});
        if (response.status === 200) {
            return response.data.message;
        }
	} 
    catch (error) {
		console.log(error);
	}
    return undefined;
}