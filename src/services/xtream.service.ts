import axios from "axios";

const api = "http://localhost:8000";

export const getXtreamM3U = async (formData: any) => {
  const url = `${formData.host}/get.php?username=${formData.username}&password=${formData.password}&type=m3u_plus`;
  const { data } = await axios.get(url);
  return data;
};

export const createPlaylist = async (data: any) => {
  const response = await axios.post(`${api}/create-playlist`, data);
  return response.data;
};

export const parsePlaylist = async (id: any) => {
  const response = await axios.get(`${api}/parse-playlist/${id}`);
  return response.data;
};


export const getData = async (id:string,type:string,category:string,page:number) => {
    let url = `${api}/get-data/${id}/${type}/?page=${page}`;
    if (category) {
        url += `&category=${encodeURIComponent(category)}`;
    }
    const response = await axios.get(url);
    return response.data;
}

export const updateCategory = async (id:string,isVisible:string) => {
    const response = await axios.put(`${api}/update-category/${id}`, { isVisible });
    return response.data;
}