const backendurl = "http://localhost:5046/";
// const backendurl = "https://fidebill-cqbradhucreue7bv.canadacentral-01.azurewebsites.net/";

export async function GET(url, data){
    const objString = '?' + new URLSearchParams(data).toString();
    return await fetch(backendurl + url + objString, {
        method: 'GET',
        mode: 'cors',
        headers:{
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    })
    .then((res) => res)
    .catch((err)=>console.log(err));
}

export async function POST(url, data){
    return await fetch (backendurl + url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
        })
        .then((res)=>res)
        .catch((err)=> console.log(err))
}

export async function POSTFormData(url, file, extraData = {}) {
    const formData = new FormData();
    
    if (file) {
        formData.append("file", file);
    }

    Object.keys(extraData).forEach(key => {
        if (Array.isArray(extraData[key])) {
            formData.append(key, JSON.stringify(extraData[key]));
        }else{
            formData.append(key, extraData[key]);
        }
    });
    console.log(formData);

    return await fetch(backendurl + url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem('token')}`
        },
        body: formData
    })
    .then(res => res.json())
    .catch(err => console.error("Error al subir imagen:", err));
}

export async function PATCH(url, data){
    return await fetch (backendurl + url, {
        method: 'PATCH',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
        })
        .then((res)=>res)
        .catch((err)=> console.log(err))
}