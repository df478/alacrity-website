---
id: run-locally
title: Run Locally
sidebar_label: Run Locally
---

<br/>
Note that this is an **advanced process**. Some of the concepts used in this section are not easy for the beginners. In order to run AlaCrity on your local machine (just for testing and development) you need Docker installed on your machine.

As for the root domain, by default, AlaCrity uses `http://alacran.alacran.localhost`. On most systems, `alacran.alacran.localhost` automatically resolves to local ip address of the machine, i.e. 127.0.0.1 and therefore no additional work is needed.

> However, if it doesn't do that automatically, you need to manually point `*.alacran.localhost` to `127.0.0.1` or `192.168.1.2` (your local ip). **NOTE** that `etc/hosts` won't be enough as Alacran needs a wildcard entry and `etc/hosts` does not allow wildcards, i.e. `*.something`. On ubuntu 16, `dnsmasq` (a local DNS server) is built-in. So, it's as simple as editing this file: `/etc/NetworkManager/dnsmasq.d/dnsmasq-localhost.conf` (create it if it does not exist) and adding this line to it: `address=/alacran.localhost/192.168.1.2` where `192.168.1.2` is your local IP address. To make sure you have `dnsmasq`, you can run `which dnsmasq` on your terminal. If it's available, its path will be printed on the terminal, otherwise, there won't be anything printed on your terminal.

To verify that you have both prerequisites mentioned above:

- Run `docker version` and make sure your version is at least the version mentioned in the [docs](get-started.md#c-install-docker-on-server-at-least-version-1706x)
- Run `nslookup randomstring123.alacran.localhost` and make sure it resolves to `127.0.0.1` or your local ip (something like `192.168.1.2`):

```
Server:		127.0.1.1
Address:	127.0.1.1#53

Name:	randomstring123.alacran.localhost
Address: 192.168.1.2
```

## Installation

Once you have confirmed that you have the prereqs ready, you can go ahead and install Alacran on your machine, similar to what you do on your server. Make sure you run as a user with sufficient permission, i.e. `sudo` on linux based systems. Just follow the steps outlined here: [Alacran Installation](get-started#step-1-alacran-installation), except for a few differences mentioned below.

### Differences:

#### Main IP

First of all, the installation command for local installation requires an extra parameter (`MAIN_NODE_IP_ADDRESS`)

```bash
echo  "{\"skipVerifyingDomains\":\"true\"}" >  /alacran/data/config-override.json
docker run -e ACCEPTED_TERMS=true -e MAIN_NODE_IP_ADDRESS=127.0.0.1 -p 80:80 -p 443:443 -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock -v /alacran:/alacran df478/alacrity
```

#### Setup

Do not run `alacrity serversetup`. Instead, go to http://alacran.alacran.localhost:3000 and manually set root domain to `alacran.localhost`. DO NOT enable/force HTTPS. Obviously, you cannot enable HTTPS on your local domain (alacran.localhost).

Once you set your root domain as `alacran.localhost`, use `alacrity login` and enter `http://alacran.alacran.localhost` as your alacran URL and `alacran42` as your default password.

> However, if you want to access your AlaCrity instance from another device on your LAN, you can set the root domain to `alacran.LOCAL_IP.sslip.io` (for example `alacran.192.168.1.2.sslip.io`).

**NON-LINUX USERS**
You need to add `/alacran` to shared paths.
To do so, click on the Docker icon -> Setting -> File Sharing and add `/alacran`

You are set!

## Install AlaCrity on a Private [local] Network

This is handy when you want to install AlaCrity on your home network, for example on a Raspberry pi.

Imagine you have this network:

```
┌───────────────────────┐
│    Your Router        │
│                       │
│     public IP         │
│    11.22.33.44        │           your private network
├───────────────────────┴─────────────────────────────────────────────────────────────────────┐
│                                                                                             │
│ ┌────────────────┐      ┌──────────────────┐        ┌──────────────────┐                    │
│ │                │      │                  │        │                  │                    │
│ │    PC1         │      │     PC2          │        │       PC3        │                    │
│ │                │      │                  │        │                  │                    │
│ │  192.168.1.10  │      │    192.168.1.11  │        │    192.168.1.12  │                    │
│ │                │      │                  │        │                  │                    │
│ └────────────────┘      └──────────────────┘        └──────────────────┘                    │
│                                                                                             │
│                                                                                             │
│                                                                                             │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

You can install AlaCrity on PC3 by simply running this command:

```bash
echo  "{\"skipVerifyingDomains\":\"true\"}" >  /alacran/data/config-override.json
docker run -e ACCEPTED_TERMS=true -e MAIN_NODE_IP_ADDRESS=192.168.1.12 -p 80:80 -p 443:443 -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock -v /alacran:/alacran df478/alacrity
```

The only extra bit is this: ` -e MAIN_NODE_IP_ADDRESS=192.168.1.12` and also disabling domain verification on AlaCrity.

At this point, you should be able to access your AlaCrity dashboard from PC1 and PC2 via `http://192.168.1.12:3000` on your browser.

Still you aren't able to deploy apps, but the dashboard should be accessible.
If the dashboard isn't accessible, you have an internal firewall that prevents PC1 from accessing PC3.

If the dashboard is accessible, move on to the next stages.

### option 1 - only internal usecase:

You can install AlaCrity on your internal network so that it's only accessible from your private network. If you want to do that, you have to assign `*.alacrityinstance.local` or something similar in your local DNS server to point to `192.168.1.12`. If you don't have a local DNS server you cannot do this.

Some local DNS servers, don't allow wildcard in the local DNS entries, in that case, you have to add `alacran.alacrityinstance.local` to point to the IP. and in the future, add your apps names one by one. It's tedious but doable.

Now, go to the dashboard via `http://192.168.1.12:3000` and update the root domain to `alacrityinstance.local`.

At this point, you should be able to access the dashboard via `http://alacran.alacrityinstance.local` in your browser.
If you are having problem here, it means your local DNS server isn't working as expected. You'll have to fix it.

Note that you should not (cannot) enable HTTPS for internal domains.

### option 2 - make the instance accessible from the outside.

requirement: your public IP address must be a static IP address.

This is very similar to how you install AlaCrity on a publicly available VPS. All you need to do is to enable port forwarding on your router:

```
port 80 of router => port 80 of 192.168.1.12
port 443 of router => port 80 of 192.168.1.12
```

Now use your regular DNS provider and map `*.domain.com` to the public IP address of your network.

Now, like a normal installation, just login to `http://192.168.1.12:3000` and update the root domain to `domain.com`

At this point, your instance should be accessible from `http://alacran.domain.com`. You can enable HTTPS and deploy your apps.
