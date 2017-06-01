# streamers

A Node.js application built on the express.js framework using sockets.io

### Running On Your Computer

Assuming node is installed on your computer, clone or download the zip, navigate to the folder and run 

```
npm install
```

This will install the necessary dependencies. Now Navigate to 

```
public/js/dependencies
```

Open the app.js file, and edit line 1 

```
io.connect('locahost:3000')
```
to suit your current network ip.
(can be found on _connection information_ in networks drop down in the panel/menu bar)

Hit 
```
node app
```

### Accessing Streamers and collaborating on the PlayList

Navigate to http://localhost:3000 on your browser to land on the login page
Enter using 

```
[yourname].[groupname]
```

Share your group name and network ip with friends on the same network to collaborate on your playlist, and play the music from your computer!
