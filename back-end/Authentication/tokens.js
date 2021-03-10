let validTokens = [];

function checkToken(token){
    const lookup = validTokens.filter(tok => tok === token);
    return (lookup.length > 0);
}

function addToken(token){
    validTokens.push(token);
}

function deleteToken(token){
    validTokens = validTokens.filter(tok => tok !== token);
}

function clearTokens(){
    validTokens = [];
}

module.exports = {
    checkToken,
    addToken,
    deleteToken,
    clearTokens
}