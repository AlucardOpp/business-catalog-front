const mapInit = () => {
  const myMap = new ymaps.Map('map', {
    center: [54.22019715558561, 44.448889951251],
    zoom: 9,
  });

  const redCoords = [
    [54.422251814108, 45.322027847298294],
    [54.43186044174936, 45.332327529915496],
    [54.415844804920326, 45.346060440071746],
    [54.32604456497944, 43.32578759179032],
    [54.09106653463098, 43.22279076561844]
  ];

  const blueCoords = [
    [54.318013214108994, 44.4383150787436],
    [54.3035592216153, 44.46440760804048],
    [54.42810563616309, 43.75812457039163],
    [54.0333466411536, 44.407135788664185]
  ];

  const getRedOptions = () => {
    return {
      iconLayout: 'default#image',
      iconImageHref: './img/svg/red-marker.svg',
      iconImageSize: [29, 39],
    };
  };

  const redObjects = [];
  for (let i = 0; i < blueCoords.length; i++) {
    redObjects[i] = new ymaps.Placemark(redCoords[i], {}, getRedOptions());
  }


  const iconNumberLayout = ymaps.templateLayoutFactory.createClass(
      '<div style="color: #000000; font-weight: 700; font-family: Montserrat; font-size: 24px; line-height: 110%; margin-top: 11px;">{{ properties.geoObjects.length }}</div>'
  );

  const redClusterer = new ymaps.Clusterer({
    clusterIcons: [
      {
        href: './img/svg/red-clusterer-less-10.svg',
        size: [48, 48],
        offset: [0, 0],
      },
      {
        href: './img/svg/red-clusterer-more-10.svg',
        size: [56, 56],
        offset: [0, 0],
      }
    ],
    clusterNuymbers: [10],
    clusterIconContentLayout: iconNumberLayout,
  });
  redClusterer.add(redObjects);

  const getBlueOptions = () => {
    return {
      iconLayout: 'default#image',
      iconImageHref: './img/svg/blue-marker.svg',
      iconImageSize: [29, 39],
    };
  };

  const blueObjects = [];
  for (let i = 0; i < blueCoords.length; i++) {
    blueObjects[i] = new ymaps.Placemark(blueCoords[i], {}, getBlueOptions());
  }

  const blueClusterer = new ymaps.Clusterer({
    clusterIcons: [
      {
        href: './img/svg/blue-clusterer-less-10.svg',
        size: [48, 48],
        offset: [0, 0],
      },
      {
        href: './img/svg/blue-clusterer-more-10.svg',
        size: [56, 56],
        offset: [0, 0],
      }
    ],
    clusterNuymbers: [10],
    clusterIconContentLayout: iconNumberLayout,
  });
  blueClusterer.add(blueObjects);

  myMap.geoObjects.add(redClusterer);
  myMap.geoObjects.add(blueClusterer);

  const industrialCategory = document.querySelector('#industrial');
  const agroCategory = document.querySelector('#agro');

  industrialCategory.addEventListener('change', () => {
    if (industrialCategory.checked === true) {
      myMap.geoObjects.add(redClusterer);
    } else {
      myMap.geoObjects.remove(redClusterer);
    }
  });

  agroCategory.addEventListener('change', () => {
    if (agroCategory.checked === true) {
      myMap.geoObjects.add(blueClusterer);
    } else {
      myMap.geoObjects.remove(blueClusterer);
    }
  });


  myMap.controls.remove('searchControl');
  myMap.controls.remove('trafficControl');
  myMap.controls.remove('typeSelector');
  myMap.controls.remove('rulerControl');
};

ymaps.ready(mapInit);

export {mapInit};
