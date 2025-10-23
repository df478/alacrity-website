---
id: cli-commands
title: CLI Commands
sidebar_label: CLI Commands
---

<br/>

You can use this CLI tool to deploy your apps. Before anything, install the CLI tool using npm:
```
npm install -g alacrity-cli
```

### Server Setup

The very first thing you need to do is to setup your Alacran server. You can either do this by visiting `HTTP://IP_ADDRESS_OF_SERVER:3000` in your browser, or the recommended way which is the command line tool. Simple run
```
alacrity serversetup
```

Follow the steps as instructed, enter IP address of server. Enter the root domain to be used with this Alacran instance. If you don't know what Alacran root domain is, please visit www.alacrity.com for documentation. This is a very crucial step. After that, you'll be asked to enter your email address. This should be a valid email address as it will be used in your SSL certificate. After HTTPS is enabled, you'll be asked to change your password. And... Your are done! Go to Deploy section below to read more about app deployment.


### Login

*If you've done the "Server Setup" process through the command line. You can skip "Login" step because "server setup" automatically logs you in as the last step of setup.*

The very first thing you need to do is to login to your Alacran server. It is recommended that at this point you have already set up your HTTPS. Login over insecure, plain HTTP is not recommended.

To log in to server, simply run the following line and answer the questions.

```bash
alacrity login
```

If operation finishes successfully, you will be prompted with a success message.

NOTE: You can be logged in to several Alacran servers at the same time. This is particularly useful if you have separate staging and production servers.

### Deploy

In order to deploy your application, you first need to create a alacran-definition file and place it in the root of your project folder. In case of a nodejs application, this would sit in the same folder as your package.json.

A simple alacran-definition file for a nodejs application is:

```
 {
  "schemaVersion": 2,
  "templateId": "node/8.7.0"
 }
```

See  [Alacran Definition File](alacran-definition-file.md) for more details on the Alacran Definition file.

After making sure that this file exists, run the following command and answer the questions given:

```bash
alacrity deploy
```

You will then see your application being uploaded and, after that, your application getting built. Note that the build process can take several minutes, so please be patient!

To use the previously-entered values for the current directory, without being asked again, use the `-d` option:

```bash
alacrity deploy -d
```

Alternatively, you can use the stateless mode and supply the AlaCrity server information inline:
```bash
alacrity deploy -h https://alacran.root.domain.com -p password -b branchName -a app-name 
```

This can be useful if you want to integrate CI/CD pipeline.

#### Options:
Those params are available:
- `-d, --default`: Uses previously entered values for the current directory. Other options are not considered.
- `-c, --configFile <file>`: Specifies a configuration file to use for deployment settings.
- `-u, --alacrityUrl <url>`: Sets the AlaCrity machine URL to which the deployment will be made. This URL is typically in the format [http[s]://][alacran.].your-alacran-root.domain.
- `-p, --alacrityPassword <password>`: The password for the AlaCrity machine. This option is prompted when a URL is provided and an app token is not used.
- `-n, --alacrityName <name>`: The name of the AlaCrity machine you wish to deploy to. This can be selected from a list of logged-in machines.
- `-a, --alacrityApp <app>`: Specifies the application name on the AlaCrity machine to which you are deploying. This is selected from a list of available applications on the machine.
- `-b, --branch <branch>`: Specifies the Git branch to be deployed. Note that uncommitted and git-ignored files will not be included.
- `-t, --tarFile <tarFile>`: Specifies the path to a tar file which must include a alacran-definition file for deployment.
- `-i, --imageName <image>`: Specifies a Docker image to be deployed. The image must exist on the server or be accessible through public or private repositories that AlaCrity can access.
- `--appToken <token>`: An optional token for app-level authentication, if required.


### List logged in servers

To see a list of servers you are currently logged in to, run the following line:

```bash
alacrity list
```

### Logout

Run the following command:

```bash
alacrity logout
```
