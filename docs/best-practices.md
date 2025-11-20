---
id: best-practices
title: Best Practices
sidebar_label: Best Practices
---

AlaCrity is designed to be easy to use and intuitive. Having said that, there are a few tips and tricks that can help you get the most out of AlaCrity.

### Hidden Root Domain

It's always a good practice to hide your tech stack from the potential attacker. To be extra secure, you can hide your root domain two levels deeper than your wildcard DNS settings. For example on your DNS panel you set

```bash
A RECORD:

*.server.domain.com   >>>>   123.123.123.123
```

Then when setting up AlaCrity, instead of entering `server.domain.com`, enter `something.server.domain.com`. This way, you can access the dashboard via `alacran.something.server.domain.com` and not `alacran.server.domain.com`. You can then set your app's domain to `myapp.server.domain.com` under the app's HTTP settings to hide your root domain.

Keep in mind this is not a shield that protects you from everything. It's just a security measure that makes it harder, and nearly impractical for some brute force attackers to attack your AlaCrity infrastructure.

### Custom Default Password

AlaCrity uses `alacran42` as its default password. This is usually safe as you can change your password by running `alacrity serversetup` from your local machine right after the server installation is finished. However, this leaves a small window of 30 seconds or so for the attacker to change your password before you. This is very unlikely, but it's possible for this attack to happen. The attacker needs to know the exact attack window on a particular machine. Anyways, to mitigate this risk, simply choose a custom initial password when installing AlaCrity by adding `DEFAULT_PASSWORD` env var to the installation script. For example, the script below changes the default password from `alacran42` to `myinitialpassword`

```bash
docker run -e ACCEPTED_TERMS=true -e DEFAULT_PASSWORD='myinitialpassword' -p 80:80 -p 443:443 -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock -v /alacran:/alacran df478/alacrity
```

### Enforce HTTPS

It is highly recommended that one of the first things you do is to enable HTTPS and enable "Enforce HTTPS" for your AlaCrity dashboard. After you've done all these, you should change your password. Note that if you are using `alacrity serversetup` wizard, you will be doing this process automatically, no need to change your password after the setup.

### Use Service Accounts for Git

One of the most popular features of AlaCrity is the automatic deployment from source control (GitHub, BitBucket, GitLab and etc...). For this approach to work with a private repository, you have to enter your username/password and they will be kept as encrypted content on your server. It is always a good practice to create a service account (bot account) on GitHub and etc, and give that account specific permission (read only) to certain repositories only. Such that if that account was compromised, your main owner account remains intact and you can remove the compromised account from the repo.

### Out of Memory when Building

When you build on a paid service such as Heroku, your build process happens on a machine with high CPU and RAM. When you use AlaCrity, your build is done on the same machine that serves your app. This is not a problem until your app gets too big and the build process requires too much RAM. In that case, your build process might crash! There are multiple solutions:

1- Add swap space to the web server, explained [**here**](https://www.digitalocean.com/community/tutorials/how-to-add-swap-space-on-ubuntu-16-04).

2- Build on your local machine. For example, this process is explained in detail [**here**](recipe-deploy-create-react-app.md) for Create React App.

3- However, **the best solution** is to use a separate build system. You can see the guide [**here**](ci-cd-integration.md)

### Customize the NGINX Config for new apps

Moved to https://alacrity.com/docs/nginx-customization.html#customize-and-override-the-nginx-config-for-all-apps

This section is kept here to avoid link breaking.
