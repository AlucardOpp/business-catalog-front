const mapInit = () => {
  const map = document.querySelector('#map');

  if (!map) {
    return;
  }

  const zoomControl = new ymaps.control.ZoomControl({
    options: {
      float: 'none',
      position: {
        right: '15px',
        top: '100px',
      },
    },
  });

  const geolocationControl = new ymaps.control.GeolocationControl({
    options: {
      float: 'none',
      position: {
        right: '15px',
        bottom: '155px',
      },
    },
  });


  const myMap = new ymaps.Map('map', {
    center: [54.22019715558561, 44.448889951251],
    zoom: 9,
    controls: [zoomControl, geolocationControl],
  }, {
    minZoom: 8
  });

  const customBalloonContentLayout = ymaps.templateLayoutFactory.createClass([
    '<ul class=cluster-list>',
    '{% for geoObject in properties.geoObjects %}',
    '<li class="cluster-item"><div class="cluster-info">{{ geoObject.properties.balloonContentHeader|raw }}</div>{{ geoObject.properties.balloonContentFooter|raw }}</li>',
    '{% endfor %}',
    '</ul>'
  ].join(''));


  let coords = [];
  let redCoords = [];
  let blueCoords = [];

  if (map.getAttribute('data-coords').length > 0) {
    coords = JSON.parse(map.getAttribute('data-coords'));
    const coordsKeys = Object.keys(coords);
    const coordsAmount = Object.keys(coords).length

    for (let i = 0; i < coordsAmount; i++) {
      let redMarkers = 0;
      let blueMarkers = 0;
      const coord = coords[coordsKeys[i]];
      if (coord[2] === 'red') {
        let currentCoords = [];
        currentCoords.push(coord[0]);
        currentCoords.push(coord[1]);
        currentCoords.push(coordsKeys[i]);
        redCoords.splice(redMarkers, 0, currentCoords);
        redMarkers++;
      } else if (coord[2] === 'blue') {
        let currentCoords = [];
        currentCoords.push(coord[0]);
        currentCoords.push(coord[1]);
        currentCoords.push(coordsKeys[i]);
        blueCoords.splice(blueMarkers, 0, currentCoords);
        blueMarkers++;
      }
    }
  }

  let redKeys = [];
  redCoords.forEach(coord => {
    redKeys.push(coord[2]);
  });
  redKeys = redKeys.join(', ');

  let blueKeys = [];
  blueCoords.forEach(coord => {
    blueKeys.push(coord[2]);
  });
  blueKeys = blueKeys.join(', ');

  const iconNumberLayout = ymaps.templateLayoutFactory.createClass(
      '<div style="color: #000000; font-weight: 700; font-family: Montserrat; font-size: 24px; line-height: 110%; margin-top: 11px;">{{ properties.geoObjects.length }}</div>'
  );

  const getRedOptions = () => {
    return {
      iconLayout: 'default#image',
      iconImageHref: '/local/templates/main/img/svg/red-marker.svg',
      iconImageSize: [29, 39],
    };
  };

  const getBlueOptions = () => {
    return {
      iconLayout: 'default#image',
      iconImageHref: '/local/templates/main/img/svg/blue-marker.svg',
      iconImageSize: [29, 39],
    };
  };

  const placeMarks = async () => {
    if (redCoords.length > 0) {
      const data = new FormData();
      data.append('id', redKeys);
      const redObjects = [];
      const response = await fetch(`/local/ajax/contactsBody.php`, {
        method: "POST",
        body: data,
      });
      const json = await response.json();
      for (let i = 0; i < redCoords.length; i++) {
        const title = json[redCoords[i][2]].title;
        const subtitle = json[redCoords[i][2]].subtitle;
        const address = json[redCoords[i][2]].address;
        const phones = json[redCoords[i][2]].phones;
        const link = json[redCoords[i][2]].link;

        redObjects[i] = new ymaps.Placemark(redCoords[i], {
          balloonContentHeader: `<p class="balloon-title">${title}</p>` +
              ((subtitle === null) ? '' : `<p class="balloon-subtitle">${subtitle}</p>`),
          balloonContentBody: `<p class="balloon-address">${address}</p>` +
              (!(phones[0] === null) ? `<p class="balloon-contacts"><span class="balloon-tel">${phones[0]}</span>` + ((phones[1]) ? `<span class="balloon-tel">, ${phones[1]}</span>` : '') +`</p>` : ''),
          balloonContentFooter: `<a class="balloon-button btn" href="${link}"><svg width="38" height="39" viewBox="0 0 38 39" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.1667 5.25V8.41667H27.8508L12.2867 23.9808L14.5192 26.2133L30.0833 10.6492V16.3333H33.25V5.25M30.0833 30.5833H7.91667V8.41667H19V5.25H7.91667C7.07681 5.25 6.27136 5.58363 5.6775 6.1775C5.08363 6.77136 4.75 7.57681 4.75 8.41667V30.5833C4.75 31.4232 5.08363 32.2286 5.6775 32.8225C6.27136 33.4164 7.07681 33.75 7.91667 33.75H30.0833C30.9232 33.75 31.7286 33.4164 32.3225 32.8225C32.9164 32.2286 33.25 31.4232 33.25 30.5833V19.5H30.0833V30.5833Z" fill="white"/></svg><span>Подробнее</span></a>`,
          hintContent: `${title}`,
        }, getRedOptions());
      }

      const redClusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        clusterBalloonPanelMaxMapArea: 0,
        clusterBalloonMaxHeight: 200,
        clusterBalloonContentLayout: customBalloonContentLayout,
        clusterIcons: [
          {
            href: '/local/templates/main/img/svg/red-clusterer-less-10.svg',
            size: [48, 48],
            offset: [-32, -16],
          },
          {
            href: '/local/templates/main/img/svg/red-clusterer-more-10.svg',
            size: [56, 56],
            offset: [-32, -16],
          }
        ],
        clusterNuymbers: [10],
        clusterIconContentLayout: iconNumberLayout,
      });
      redClusterer.add(redObjects);

      myMap.geoObjects.add(redClusterer);

      const industrialCategory = document.querySelector('#industrial');

      if (industrialCategory) {
        industrialCategory.addEventListener('change', () => {
          if (industrialCategory.checked === true) {
            myMap.geoObjects.add(redClusterer);
          } else {
            myMap.geoObjects.remove(redClusterer);
          }
        });
      }
    }

    if (blueCoords.length > 0) {
      const data = new FormData();
      data.append('id', blueKeys);
      const blueObjects = [];
      const response = await fetch(`/local/ajax/contactsBody.php`, {
        method: "POST",
        body: data,
      });
      const json = await response.json();
      for (let i = 0; i < blueCoords.length; i++) {
        const title = json[blueCoords[i][2]].title;
        const subtitle = json[blueCoords[i][2]].subtitle;
        const address = json[blueCoords[i][2]].address;
        const phones = json[blueCoords[i][2]].phones;
        const link = json[blueCoords[i][2]].link;
        blueObjects[i] = new ymaps.Placemark(blueCoords[i], {
          balloonContentHeader: `<p class="balloon-title">${title}</p>` +
              ((subtitle === null) ? '' : `<p class="balloon-subtitle">${subtitle}</p>`),
          balloonContentBody: `<p class="balloon-address">${address}</p>` +
              (!(phones[0] === null) ? `<p class="balloon-contacts"><span class="balloon-tel">${phones[0]}</span>` + ((phones[1]) ? `<span class="balloon-tel">, ${phones[1]}</span>` : '') +`</p>` : ''),
          balloonContentFooter: `<a class="balloon-button btn" href="${link}"><svg width="38" height="39" viewBox="0 0 38 39" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.1667 5.25V8.41667H27.8508L12.2867 23.9808L14.5192 26.2133L30.0833 10.6492V16.3333H33.25V5.25M30.0833 30.5833H7.91667V8.41667H19V5.25H7.91667C7.07681 5.25 6.27136 5.58363 5.6775 6.1775C5.08363 6.77136 4.75 7.57681 4.75 8.41667V30.5833C4.75 31.4232 5.08363 32.2286 5.6775 32.8225C6.27136 33.4164 7.07681 33.75 7.91667 33.75H30.0833C30.9232 33.75 31.7286 33.4164 32.3225 32.8225C32.9164 32.2286 33.25 31.4232 33.25 30.5833V19.5H30.0833V30.5833Z" fill="white"/></svg><span>Подробнее</span></a>`,
          hintContent: `${title}`,
        }, getBlueOptions());
      }

      const blueClusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        clusterBalloonPanelMaxMapArea: 0,
        clusterBalloonMaxHeight: 200,
        clusterBalloonContentLayout: customBalloonContentLayout,
        clusterIcons: [
          {
            href: '/local/templates/main/img/svg/blue-clusterer-less-10.svg',
            size: [48, 48],
            offset: [-32, -16],
          },
          {
            href: '/local/templates/main/img/svg/blue-clusterer-more-10.svg',
            size: [56, 56],
            offset: [-32, -16],
          }
        ],
        clusterNuymbers: [10],
        clusterIconContentLayout: iconNumberLayout,
      });
      blueClusterer.add(blueObjects);

      myMap.geoObjects.add(blueClusterer);

      const agroCategory = document.querySelector('#agro');

      if (agroCategory) {
        agroCategory.addEventListener('change', () => {
          if (agroCategory.checked === true) {
            myMap.geoObjects.add(blueClusterer);
          } else {
            myMap.geoObjects.remove(blueClusterer);
          }
        });
      }
    }

    if (redCoords.length > 0 || blueCoords.length > 0) {
      myMap.setBounds(myMap.geoObjects.getBounds(), {checkZoomRange: true, zoomMargin: 9});
    }
  }

  placeMarks();
};

ymaps.ready(mapInit);

export {mapInit};
