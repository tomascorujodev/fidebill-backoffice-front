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
    console.log(data);
    console.log(JSON.stringify(data))
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