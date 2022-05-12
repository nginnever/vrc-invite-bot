const vrchat = require("vrchat");
const async = require("async");

const configuration = new vrchat.Configuration({
    username: "",
    password: ""
});

// Step 2. VRChat consists of several API's (WorldsApi, UsersApi, FilesApi, NotificationsApi, FriendsApi, etc...)
// Here we instantiate the Authentication API which is required for logging in.
const AuthenticationApi = new vrchat.AuthenticationApi(configuration);
const NotificationApi = new vrchat.NotificationsApi(configuration);

// Step 3. Calling getCurrentUser on Authentication API logs you in if the user isn't already logged in.
AuthenticationApi.getCurrentUser().then(resp => {
    const currentUser = resp.data;
    console.log(`Logged in as: ${currentUser.displayName}`);
});

function delay(t) {
   return new Promise(function(resolve) {
       setTimeout(function() {
           resolve();
       }, t);
   });
}

(async function() {
    while (true) {
        await delay(5000)
        console.log("Polling for friendRequest...")
        NotificationApi.getNotifications().then(res => {
            res.data.map(item => {
                if(item.type === "friendRequest"){
                    console.log("Incoming friendRequest from: " + item.senderUsername)
                    NotificationApi.acceptFriendRequest(item.id).then(res => {
                        console.log("Friend request accepted: ");
                        console.log(res.data);
                    });
                }
            })
        })
    }
})()
