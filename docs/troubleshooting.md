---
id: troubleshooting
title: Troubleshooting
sidebar_label: Troubleshooting
---

<br/>

This section covers most frequent issues that users may encounter.

## Cannot connect <ip_server>:3000?

There is a whole set of reasons for this.

#### First)

You need to make sure that AlaCrity is running on your server. To check this, ssh to your server and run

```bash
docker service ps alacran-alacran --no-trunc
```

You might see Alacran is getting restarted constantly due to an error. Fix the issue and retry.

#### Second)

If you don't see any errors when your ran `docker service ps alacran-alacran --no-trunc`, then try

```bash
docker service logs alacran-alacran --since 60m

## you should also get the logs from nginx

docker service logs alacran-nginx --since 60m
```

You might see that AlaCrity is getting restarted constantly due to an error.

#### Third)

If both "First" and "Second" debugging steps explained above worked fine and there is no error seen in the logs, run this command on your server:

```bash
 curl localhost:3000 -v
```

If successful, it's probably your firewall that's blocking the connection. See [Firewall Docs](firewall.md).

## Successful Deploy but 502 bad gateway error!

This applies to you if:

- You have been able to setup your server and access it via `alacran.rootdomain.example.com`.
- You have been able to deploy one of the samples apps (see [here](https://github.com/alacrity/alacrity/tree/master/alacran-sample-apps)) successfully and it worked.
- You tried to deploy your own application and it deployed successfully, but when you try to access it via `yourappname.root.example.com` you get a 502 error.

If all above points are correct, this is how to troubleshoot:

- SSH to your server and view your application logs. Make sure it hasn't crashed and it's running. To view logs, please see the section at the end of this page "[How to view my application's log](#how-to-view-my-applications-log)"
- If you application logs show that your application is running, the most common case is that your application is binding to a custom port, not port 80. For example, CouchDB runs at port 5984. In this case, go to app's settings on AlaCrity, go to HTTP Settings, then select 5984 as the "Container Port".
- If your app defines the binding IP address as 127.0.0.1, change it to `0.0.0.0`, see [this issue](https://github.com/alacrity/alacrity/issues/76#issuecomment-481053496) for more details.

## Domain Verification Failed - Error 1107!

This happens when AlaCrity cannot verify that yourcustomdomain.com points to the IP address of AlaCrity. This can be caused by several factors:

- DNS changes take up to 24 hrs to propagate, specially if your server had cached them before. So wait for 24hrs and retry again. If it doesn't work, proceed to the next step:
- To confirm, go to https://mxtoolbox.com/DNSLookup.aspx and enter `yourcustomdomain.com`. Make sure it points to the server IP. If you're using a proxy service like CloudFlare, this may cause a problem. Disable their proxy in your DNS on CloudFlare and have A record directly point to the IP address of your AlaCrity server.
- If you tested all above, and when you visit `something.domain.com` you see the AlaCrity page, then you can say your domain is working fine, but AlaCrity is unable to verify it because the loopback test doesn't work. In this case, you can choose to skip domain verification done by AlaCrity:

```
echo  "{\"skipVerifyingDomains\":\"true\"}" >  /alacran/data/config-override.json
docker service update alacran-alacran --force
```

- If none of the above works, please open an issue on Github.

## Connection Timeouts

Sometimes when you have an inactive database connection pool, Docker drops the connection after some time. To fix, you can do either of these:

- Implement an automatic retry strategy
- Implement a automatic ping every few minutes to ensure that the connection doesn't become inactive
- Changing Keepalive config in your app (see [here](https://github.com/alacrity/alacrity/issues/873#issuecomment-715328966) for an example on knex)
- Make changes to your Docker configs (more advanced)

## Something bad happened

When you see this error in the UI, it means something "unexpected" went wrong such as connection lost, server crashing (due to out of memory), etc. The best way to see what's happening is to get the server logs:

```
docker service logs alacran-alacran --since 5m --follow
```

## How to view my application's log?

Your application is deployed as a Docker service. For example, if your app name in alacran is `my-app` you can view your logs by connecting to your server via SSH and run the following command:

```
docker service logs srv-alacran--my-app --since 60m --follow
```

Note that Docker service name is prefixed with `srv-alacran--`. Also, you can replace 60m with 10m to view last 10 minutes.

## How to restart my application?

If your application is not behaving well, you can try force restarting it by going to the web dashboard and select your app, then click on "Save Configuration & Update" button. It will forcefully restarts your application.

## How to run shell inside my application (inside container)

Simply run the following command:

```
docker exec -it $(docker ps --filter name=srv-alacran--myappname -q) /bin/sh
```

Of course, you need to replace `myappname` with your own app name.

## I've made a change to the Nginx config that broke the admin UI!

In this case restart is not going to help. Do this.

Run the nginx fixer to revert **all nginx changes that you've manually made**:

```bash
docker service scale alacran-alacran=0 && \
docker run -it --rm -v /alacran:/alacran  df478/alacrity /bin/sh -c "wget https://raw.githubusercontent.com/df478/alacrity/master/dev-scripts/clear-custom-nginx.js ; node clear-custom-nginx.js ;" && \
docker service scale alacran-alacran=1 && \
echo "OKAY"

```

Hopefully your problem should be resolved and you can be happy.

## How to restart AlaCrity

If your AlaCrity is not behaving well, you can try force restarting AlaCrity using:

```
docker service update alacran-alacran --force
```

## Customize Config Settings

You can customize any constant defined in [AlacranConstants](https://github.com/alacrity/alacrity/blob/master/src/utils/AlacranConstants.ts) under configs by adding a JSON file at `/alacran/data/config-override.json`. For example, to change `defaultMaxLogSize`, the content of `/alacran/data/config-override.json` will be:

```
{
 "defaultMaxLogSize":"128m"
}
```

After editing this file, [restart AlaCrity](https://alacrity.com/docs/troubleshooting.html#how-to-restart-alacrity) (if the change affects AlaCrity, nginx or certbot) or turn NetData off and on again from the UI.

## Use existing swarm

When you first install AlaCrity, it tries to automatically set up a swarm cluster for you. But in rare cases, you may already have a swarm cluster, and you want to use that cluster. In this case, you can simply just override it by setting `useExistingSwarm` to true. Run the following script before attempting to install AlaCrity.

```
mkdir -p  /alacran/data
echo  "{\"useExistingSwarm\":\"true\"}" >  /alacran/data/config-override.json
```

## Reset Password

If you forgot your password but you have access to your server via SSH:

- SSH to your server
- Run

```bash
docker service scale alacran-alacran=0

# backup config
cp /alacran/data/config-alacran.json /alacran/data/config-alacran.json.backup

# delete old password
jq 'del(.hashedPassword)' /alacran/data/config-alacran.json > /alacran/data/config-alacran.json.new
cat /alacran/data/config-alacran.json.new > /alacran/data/config-alacran.json
rm /alacran/data/config-alacran.json.new

# set a temporary password
docker service update --env-add DEFAULT_PASSWORD=mytemppassword alacran-alacran
docker service scale alacran-alacran=1
```

- Login to AlaCrity with your temporary password and change your password from settings.

## How to stop and remove Alacran?

AlaCrity uses docker swarm to support clustering and restarting containers if they stop. In order to fully uninstall AlaCrity from your system, run this:

```
docker service rm $(docker service ls -q)
## remove AlaCrity settings directory
rm -rf /alacran
## leave swarm if you don't want it
docker swarm leave --force
## full cleanup of docker
docker system prune --all --force
```
