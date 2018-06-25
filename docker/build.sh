#!/bin/bash

rootPath=$GOPATH
projectName=magicSite
projectPath=$rootPath/src/muidea.com/magicSite
binPath=$projectPath/dist
imageID=""
imageNamespace=muidea.ai/develop
imageVersion=latest
imageName=$imageNamespace/$(echo $projectName | tr '[A-Z]' '[a-z]')

function cleanUp()
{
    echo "cleanUp..."
    if [ -f log.txt ]; then
        rm -f log.txt
    fi

    if [ -f $projectName ]; then
        rm -f $projectName
    fi

    if [ -f $binPath ]; then
        rm -f $binPath
    fi
}

function buildBin()
{
    echo "buildBin..."
    curPath=$(pwd)
    cd $projectPath
    npm run build
    if [ $? -ne 0 ]; then
        echo "buildBin failed."
        exit 1
    else
        echo "buildBin success."
    fi
    cd $curPath
}

function prepareFile()
{
    echo "prepareFile..."
    if [ ! -f $binPath ]; then
        buildBin
        if [ $? -ne 0 ]; then
            exit 1
        fi
    fi

    src=$(ls $binPath|tail -1)
    cp -r $binPath $src
    if [ $? -ne 0 ]; then
        echo "prepare file failed, copy failed exception."
        exit 1
    fi

    curPath=$(pwd)
    cd $src
    tar -caf ../$projectName *
    if [ $? -ne 0 ]; then
        echo "prepare file failed, compress failed exception."
        exit 1
    else
        echo "prepare filed success."
    fi
    cd $curPath
    rm -rf $src
}

function checkImage()
{
    echo "checkImage..."
    docker images | grep $1 | grep $2 > log.txt
    if [ $? -ne 0 ]; then
        echo "checkImage failed."
        exit 1
    else
        echo "checkImage success."
    fi

    imageID=$(tail -1 log.txt|awk '{print $3}')
}

function buildImage()
{
    echo "buildImage..."
    docker build . > log.txt
    if [ $? -eq 0 ]; then
        echo "buildImage success."
    else
        echo "buildImage failed."
        exit 1
    fi

    imageID=$(tail -1 log.txt|awk '{print $3}')
}


function tagImage()
{
    echo "tagImage image..."
    docker tag $1 $2
    if [ $? -eq 0 ]; then
        echo "tagImage success."
    else
        echo "tagImage failed."
        exit 1
    fi
}

function rmiImage()
{
    echo "rmiImage..."
    docker rmi $1:$2
    if [ $? -eq 0 ]; then
        echo "rmiImage success."
    else
        echo "rmiImage failed."
        exit 1
    fi
}

function all()
{
    echo "build magicBlogUI docker image"

    curPath=$(pwd)

    cd $projectPath/docker

    cleanUp

    prepareFile

    checkImage $imageName $imageVersion
    if [ $imageID ]; then
        rmiImage $imageName $imageVersion
    fi

    buildImage

    tagImage $imageID $imageName:$imageVersion

    cleanUp

    cd $curPath
}

function build()
{
    checkImage $imageName $imageVersion
    if [ $imageID ]; then
        rmiImage $imageName $imageVersion
    fi

    buildImage

    tagImage $imageID $imageName:$imageVersion    
}

action='all'
if [ $1 ]; then
    action=$1
fi

if [ $action == 'prepare' ]; then
    prepareFile
elif [ $action == 'clean' ]; then
    cleanUp
elif [ $action == 'build' ]; then
    build
else
    all
fi