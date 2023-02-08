import axios from "axios";

const BASE_URL = "https://ln9zshn1mb.execute-api.us-east-2.amazonaws.com";

const api = axios.create({
	baseURL: BASE_URL,
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
            const data: {
                message: string;
                hasCapacity: boolean;
            } = response.data;
            return {
                isSuccess: true,
                data,
            }
        }
	} 
    catch (error: any) {
        return {
            isSuccess: false,
            errorMessage: error.response.data.message,
        }
	}
    return {
        isSuccess: false,
    }
}

export async function sendEmailReceipt({ history }: {
    history: {
        message: string;
        isUser: boolean;
    }[];
}) {
    const siteId = sessionStorage.getItem("siteId");
    if (!siteId) return;
    const headers = {
        type: 'application/json',
        Authorization:`Site-ID ${siteId}`,
    };
    const body = {
        history,
    };
    const blob = new Blob([JSON.stringify(body)], headers);
	navigator.sendBeacon(`${BASE_URL}/email`, blob);
}