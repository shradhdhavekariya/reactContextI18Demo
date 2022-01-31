#!/bin/bash

which -s brew
if [[ $? != 0 ]] ; then
    echo "Installing homebrew.."
    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
fi

which -s mkcert
if [[ $? != 0 ]] ; then
    echo "Installing mkcert.."
    brew install mkcert
fi

if [[ ! -f localhost.pem || ! -f localhost-key.pem ]]; then
    echo "Creating certificates.."
    mkcert -install
    mkcert localhost
fi