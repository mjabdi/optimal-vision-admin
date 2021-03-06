export const getRole = () => {
    return sessionStorage.getItem('medexadmin-role')
}

export const setRole = (role) => {
    return sessionStorage.setItem('medexadmin-role', role)
}

export const clearRole = (role) => {
    return sessionStorage.removeItem('medexadmin-role')
}