[TOC]

# Intro
This is a simple setup to handling Stripe for BAN.  
It work by using a Nginx container for hosting the website and handle the Let's Encrypt certificate. There is also an import container which import the data from Stripe and exports it to a json-file, which is used to build the website.

## Requirement
- docker
- docker-compose

## Install
This is meant to be run from a system user. So if you don't have one create it.
```bash
# The name of the system user
NEW_USER=services

# Create the user
sudo useradd \
  --comment 'User of docker services' \
  --no-log-init \
  --create-home \
  --home-dir "/home/${NEW_USER}" \
  --groups docker \
  --system \
  --user-group \
  "${NEW_USER}"

# Secure the service users home folder
sudo chmod 700 "/home/${NEW_USER}"

# Make it so that the system this someone is load in to the user
loginctl enable-linger "${NEW_USER}"

# Set a magic variable that you need in order to use systemD, just don't think about it
cat <<"zEOFz" | sudo -u "${NEW_USER}" tee -a ~/.bashrc

### Systemd variable
export "XDG_RUNTIME_DIR=/run/user/`id -u`"
zEOFz
```

To setup the git repo change user to the system user you just created, `sudo -u "${NEW_USER}" -i` and run the follow commands
```bash
# Go to home holder
cd ~/

# Clone the git repo into the 'stripe' folder
git clone https://github.com/bestalumninetwork/payments_page stripe

Enter the 'stripe' folder
cd ~/stripe

# Setup systemD
bin/install_symbolic_links_to_services.sh

# Make the .env file from the example file
cp .env{.example,}
```

## Config
Make sure you are the service/system user (`sudo -u services -i`).  
Open the `~/stripe/.env` and set the `STRIPE_SECRET_KEY` variable. You can find it [here](https://dashboard.stripe.com/apikeys)  

For how to configure the rest of Nginx and Let's Encrypt go [here](https://github.com/dvaerum/nginx-with-certbot-in-docker) and continue reading.

## Start/Restart/Stop
Make sure you are the service/system user (`sudo -u services -i`).

```bash
# Start systemD service
systemctl --user start stripe.service

# Start and enable systemD service to run after reboot
systemctl --user enable --now stripe.service

# Stop systemD service
systemctl --user stop stripe.service

# Stop and disable systemD service to run after reboot
systemctl --user disable --now stripe.service

# Restart systemD service
systemctl --user restart stripe.service
```



