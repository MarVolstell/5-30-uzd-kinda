const API_URL = 'http://localhost:8000/api/v0/auth';
 
export const getAuthHeaders = ()=>{
    const token = localStorage.getItem('jwtToken');
    console.log('token ', token)
    return token
    ? {'Content-Type': 'application/json', Authorization: `Bearer ${token}`}
        : {'Content-Type': 'application/json'}
}
 
const fetchRequest = async (url, options = {}) =>{
    try{
        const response = await fetch(`${API_URL}${url}`,{
            ...options,
            headers: getAuthHeaders(),
        });
 
        const contentType = response.headers.get('content-type');
 
        if(!response.ok){
            if(contentType && contentType.includes('application/json')){
                const errorData = await response.json();
                const message =
                    errorData.message || errorData.error|| errorData.msg || 'Ivyko klaida';
                console.error('Klaidos atsakymas is serverio:', errorData)
                throw new Error(message)
            }else{
                const text = await response.text();
                throw new Error(text || `HTTP error: ${response.status}`)
            }
        }
 
        return await response.json()
 
    }catch(err){
        console.log('Uzklausos klaida: ', err.message);
    }
}
 
//Login
export const login = async (name, email, password) =>{
    const res = await fetchRequest('/login', {
        method: 'POST',
        body: JSON.stringify({name, email, password})
    });

    console.log('Login response: ', res)
    
    if(res.token){
        localStorage.setItem('jwtToken', res.token)
    }

    if(res.data?.id){
        localStorage.setItem('userid', res.data.id)
    }

    if(res.data?.role){
        localStorage.setItem('role', res.data.role)
    }

    return res
}

//Register
export const createUser = async (userData) =>{
    const res = await fetchRequest('/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    })

    if(res.token){
        localStorage.setItem('jwtToken', res.token)
    }

    if(res.data?.id){
        localStorage.setItem('userid', res.data.id)
    }

    return res
}
 
//Logout
 
export const logout = ()=>{
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userId')
}