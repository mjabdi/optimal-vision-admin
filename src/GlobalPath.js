

export const authToken = 'Basic QXp1cmXEaWFtb45kOmh1bnRlcjO='

export const backendAPI = 'https://www.travelpcrtest.com/'
// export const backendAPI = 'http://localhost:9090/'

export function getGlobalPath(path){
    return '/optimalvision/admin' + path
    // return path
}

export function getMenuIdFromGlobalPath(globalPath){
    try{
       
        var split = globalPath.split('/')
        if (split && split.length > 0)
        {
            return split[split.length - 1].length > 0 ?  split[split.length - 1] :  split[split.length - 2]
        }
        else
        {
            return ''
        }
    }
    catch(err)
    {
        return ''
    }
}