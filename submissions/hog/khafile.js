var project = new Project('hog');
project.addAssets('Assets/', { name: '{name}', destination:'static/hog_{name}', md5sum:true });
project.addSources('Sources');

project.addLibrary('blip');
project.addLibrary('bignumberjs');
project.addLibrary('web3');
project.addLibrary('web3helper');
project.addLibrary('ethereumjs');

project.addLibrary('kfont');
project.addLibrary('spriter');
project.addLibrary('spriterkha');
project.addLibrary('imagesheet');
project.addLibrary('mathtool');
//TODO if debug ?
//project.addLibrary('zui');

project.addParameter("-debug");
project.addParameter("-D web3_allow_privateKey");


project.targetOptions.html5.webgl = false;

resolve(project);