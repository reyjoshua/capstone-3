//The goal of this helper file is to shorten written code in various parts of the project
//if you want to create reusable functions/blocks of code that you can use in your project
//not necessary to make 
module.exports = {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
    getAccessToken: () => localStorage.getItem('token'),
    toJSON: (response) => response.json()
}