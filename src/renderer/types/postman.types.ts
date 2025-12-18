export interface PostmanVariable {
  key: string;
  value: string;
  type?: string;
}

export interface PostmanQueryParam {
  key: string;
  value: string;
  disabled?: boolean;
}

export interface PostmanUrl {
  raw: string;
  host?: string[];
  path?: string[];
  query?: PostmanQueryParam[];
  variable?: PostmanVariable[];
}

export interface PostmanHeader {
  key: string;
  value: string;
  disabled?: boolean;
}

export interface PostmanRequest {
  method: string;
  url: PostmanUrl | string;
  header?: PostmanHeader[];
}

export interface PostmanItem {
  name: string;
  id?: string;
  request?: PostmanRequest;
  item?: PostmanItem[];
}

export interface PostmanInfo {
  name: string;
  schema: string;
  _postman_id?: string;
}

export interface PostmanCollection {
  info: PostmanInfo;
  item: PostmanItem[];
  variable?: PostmanVariable[];
}
