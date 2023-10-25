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
  });


  let redCoords = [];


  if (map.getAttribute('data-red-coords').length > 0) {
    redCoords = JSON.parse(map.getAttribute('data-red-coords'));
  }

  let blueCoords = [];

  if (map.getAttribute('data-blue-coords').length > 0) {
    blueCoords = JSON.parse(map.getAttribute('data-blue-coords'));
  }

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

  if (redCoords.length > 0) {
    const redObjects = [];

    for (let i = 0; i < redCoords.length; i++) {
      redObjects[i] = new ymaps.Placemark(redCoords[i], {}, getRedOptions());
    }

    const redClusterer = new ymaps.Clusterer({
      clusterIcons: [
        {
          href: '/local/templates/main/img/svg/red-clusterer-less-10.svg',
          size: [48, 48],
          offset: [0, 0],
        },
        {
          href: '/local/templates/main/img/svg/red-clusterer-more-10.svg',
          size: [56, 56],
          offset: [0, 0],
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
    const getBlueOptions = () => {
      return {
        iconLayout: 'default#image',
        iconImageHref: '/local/templates/main/img/svg/blue-marker.svg',
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
          href: '/local/templates/main/img/svg/blue-clusterer-less-10.svg',
          size: [48, 48],
          offset: [0, 0],
        },
        {
          href: '/local/templates/main/img/svg/blue-clusterer-more-10.svg',
          size: [56, 56],
          offset: [0, 0],
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
};

ymaps.ready(mapInit);

export {mapInit};
