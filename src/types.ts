export interface AppConfig {
    name: string;
	color: string;
    textColor: string;
    headerTextColor: string;
}
  
export interface Message {
    id: string;
    isUser: boolean,
    text: string,
    timestamp: number,
}