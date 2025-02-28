#!/bin/sh

# Extract originals, create patches, delete original.

GWTVER=2.8.2
cd ../../../
SRCBASE=`pwd`
cd ../
mkdir tmp
cd tmp
TEMPDIR=`pwd`

jar xvf ${SRCBASE}/../lib/gwt/${GWTVER}/gwt-user.jar \
  com/google/gwt/user/client/ui/MenuItem.java \
  com/google/gwt/user/client/ui/DecoratorPanel.java \
  com/google/gwt/user/client/ui/VerticalPanel.java \
  com/google/gwt/user/client/ui/HorizontalPanel.java \
  com/google/gwt/user/client/ui/MenuBar.java \
  com/google/gwt/user/client/ui/SplitPanel.java \
  com/google/gwt/user/client/ui/SplitLayoutPanel.java

jar xvf ${SRCBASE}/../lib/gwt/${GWTVER}/gwt-dev.jar \
  com/google/gwt/core/linker/CrossSiteIframeLinker.java \
  com/google/gwt/core/ext/linker/impl/installLocationIframe.js
  
updatepatch () {
   diff ${TEMPDIR}/${1}/${2} ${SRCBASE}/${1}/${2} > ${SRCBASE}/${1}/${2}.diff
}

PACKAGE=com/google/gwt/user/client/ui
updatepatch ${PACKAGE} MenuItem.java
updatepatch ${PACKAGE} DecoratorPanel.java
updatepatch ${PACKAGE} VerticalPanel.java
updatepatch ${PACKAGE} HorizontalPanel.java
updatepatch ${PACKAGE} MenuBar.java
updatepatch ${PACKAGE} SplitPanel.java
updatepatch ${PACKAGE} SplitLayoutPanel.java

PACKAGE=com/google/gwt/core/ext/linker/impl
updatepatch ${PACKAGE} installLocationIframe.js

PACKAGE=com/google/gwt/core/linker
updatepatch ${PACKAGE} CrossSiteIframeLinker.java

cd ${SRCBASE}
rm -rf ${TEMPDIR}

