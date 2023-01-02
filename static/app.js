// Declare delay function (src.from "codegridweb")
function delay(n) {
  n = n || 2000;
  return new Promise((done) => {
    setTimeout(() => {
      done();
    }, n);
  });
}

// Declare page transition animation function
function pageTransition() {

  // Create vl variable that use timeline() from gsap to be able to manage timing when play animation
  var tl = gsap.timeline();

  // First animation
  tl.to(".loading-screen", {
      duration: 1.2,
      width: "100%",
      left: "0%",
      ease: "Expo.easeInOut",
  });

  // Second animation
  tl.to(".loading-screen", {
      duration: 1,
      width: "100%",
      left: "100%",
      ease: "Expo.easeInOut",
      delay: 0.3,
  });

  // Third animation
  tl.set(".loading-screen", { left: "-100%" });
}

// Declare page transition animation function that use when change to the same page (via 'once' hook)
function pageTransitionOnce() {

  // Create vl variable that use timeline() from gsap to be able to manage timing when play animation
  var tl = gsap.timeline();

  // First animation
  tl.to(".loading-screen", {
      duration: 0.5,
      width: "100%",
      left: "0%",
      ease: "Expo.easeInOut",
  });

  // Second animation
  tl.to(".loading-screen", {
      duration: 0.3,
      width: "100%",
      left: "100%",
      ease: "Expo.easeInOut",
      delay: 0.3,
  });

  // Third animation
  tl.set(".loading-screen", { left: "-100%" });
}

// Declare page transition animation function that use when change to the next page (via POST method on flask framwork)
function pageTransitionPost() {

  // Create vl variable that use timeline() from gsap to be able to manage timing when play animation
  var tl = gsap.timeline();
  tl.to(".loading-screen", {
      duration: 0.5,
      width: "100%",
      left: "0%",
      ease: "Expo.easeInOut",
  });

  // Second animation
  tl.to(".loading-screen", {
      duration: 1,
      width: "100%",
      left: "100%",
      ease: "Expo.easeInOut",
      delay: 0.3,
  });

  // Third animation
  tl.set(".loading-screen", { left: "-100%" });
}

// Declare animation function when the user has login to the website (via POST method on flask)
function contentAnimationLogined() {
  gsap.from(".animated", { duration: 1, y: 30, opacity: 0, stagger: 0.4, delay: 2 });
  gsap.from(".navbar", { duration: 1.5, ease: "bounce.out", y: -500, delay: 2 });
}

// Init Barba
barba.init({

  // Sync mode on to be able to play animation together whatever leave the page or enter the page
  sync: true,

    // Transition syntax of Barba
    transitions: [

      // Default transition animation (go to other pages)
      {
        name:"default-transition",

        // When the user leave the page
        async leave(data)
        {
          // Page transition animation
          const done = this.async();
          pageTransition();
          await delay(1000);
          done();
        },

        // When the user enter the page
        async enter()
        {
          // Animation that will play when the user enter the page
          gsap.from(".animated", { duration: 1, y: 30, opacity: 0, stagger: 0.4, delay: 1 });
        },

        // When the user reload the page or redirect to the same route
        async once()
        {
          // Page transition animation
          pageTransition();

          // Animation that will play when the user reload the page
          gsap.from(".animated", { duration: 1, y: 30, opacity: 0, stagger: 0.4, delay: 2 });
        }
      },

      // Login page transition animation (whatever leave the page or enter the page)
      {
        name: "login",

        // Give the rule to barba
        to: {namespace: ["login"]},

        // Before the user leave the page
        async beforeLeave(data)
        {
          // Animation that will play before the user leave the page
          const done = this.async();
          gsap.to(".regAni", { duration: 1, ease: "elastic.in(1, 1)", x: 900 });
          await delay(1000);
          done();
        },

        // When the user enter the page
        async enter(data)
        {
          // Animation that will play when the user enter the page
          gsap.from(".welcome", { duration: 1, ease: "elastic.out(1, 1)", y: -500 });
          gsap.from(".logAni", { duration: 1, ease: "elastic.out(1, 1)", y: 500 });
        },

        // When the user reload the page or redirect to the same route
        async once(data)
        {
          // Page transition animation
          pageTransitionOnce();

          // Animation that will play when the user reload the page
          gsap.from(".welcome", { duration: 1, ease: "elastic.out(1, 1)", y: -500 , delay: 1});
          gsap.from(".logAni", { duration: 1, ease: "elastic.out(1, 1)", y: 1000 , delay: 1});
        }
      },

      // Register page transition animation (whatever leave the page or enter the page)
      {
        name: "register",

        // Give the rule to barba
        to: {namespace: ["register"]},

        // Before the user leave the page
        async beforeLeave(data)
        {
          // Animation that will play before the user leave the page
          const done = this.async();
          gsap.to(".welcome", { duration: 1, ease: "elastic.in(1, 1)", y: -500 });
          gsap.to(".logAni", { duration: 1, ease: "elastic.in(1, 1)", y: 500 });
          await delay(1000);
          done();
        },

         // When the user enter the page
        async enter(data)
        {
          // Animation that will play when the user enter the page
          gsap.from(".regAni", { duration: 1, ease: "elastic.out(1, 1)", x: 1000 });
        },

        // When the user reload the page or redirect to the same route
        async once(data)
        {
          // Page transition animation
          pageTransitionOnce();

          // Animation that will play when the user reload the page
          gsap.from(".regAni", { duration: 1, ease: "elastic.out(1, 1)", x: 1200, delay: 1});
        }
      },

      // Apology page transition animation
      {
        name: "apology",

        // Give the rule to barba
        to: {namespace: ["apology"]},

        // When the user enter the page (Apology page will only load once)
        async once(data) {
          // Animation that will play when the user enter the page
          const done = this.async();
          pageTransitionPost();
          gsap.from(".animated", { duration: 1, y: 30, opacity: 0, stagger: 0.4, delay: 2 });
          done();
        }
      },

      // Index page transition animation
      {
        name: "loggin",

        // Give the rule to barba
        to: {namespace: ["home"]},

        // When the user load to the page (via POST method on flask or reload the page)
        async once(data) {
          // Animation that will play when the user load to the index page
          const done = this.async();
          pageTransitionPost();
          gsap.from(".animated", { duration: 1, y: 30, opacity: 0, stagger: 0.4, delay: 2 });
          gsap.from(".navbar", { duration: 1.5, ease: "back.out", y: -75, delay: 2 });
          done();
        },

        // When the user enter the page
        async enter(data) {
          //Animation that will play when the user enter to the index page
          const done = this.async();
          pageTransition();
          gsap.from(".animated", { duration: 1, y: 30, opacity: 0, stagger: 0.4, delay: 1.5 });
          done();
        }
      },

      // Page transition animation to the siam, kaset, bencha route pages
      {
        name: "main",

        // Give the rule to barba
        to: {namespace: ["siam","kaset","bencha"]},

        // When the user load to the pages (via POST method on flask)
        async once(data) {
          // Animation that will play when the user load to the page
          const done = this.async();
          pageTransitionPost();
          gsap.from(".animated", { duration: 1, y: 30, opacity: 0, stagger: 0.4, delay: 2 });
          done();
        },

        // When the user leave the page
        async leave(data) {
          // Animation that will play when the user leave the page
          const done = this.async();
          pageTransitionPost();
          gsap.from(".animated", { duration: 1, y: 30, opacity: 0, stagger: 0.4, delay: 2 });
          done();
        }
      },

      // Logout page transition animation
      {
        name: "logout",

        // Give the rule to barba
        from: {namespace: ["home", "main", "contact", "siam", "kaset", "bencha"]},
        to: {namespace: ["login"]},

        // When the user leave the page
        async leave(data) {
          // Animation that will play when the user leave the page
          const done = this.async();
          pageTransition();
          done();
        },

        // When the user enter the page
        async enter(data) {
          // Animation that will play when the user leave the page
          gsap.from(".welcome", { duration: 1, y: 30, opacity: 0, stagger: 0.4, delay: 1.5 });
          gsap.from(".logAni", { duration: 1, y: 30, opacity: 0, stagger: 0.4, delay: 2 });
        }
      }
    ],
});

// Declare function that init map for siam page
function initMapSiam() {

  // Create variable that will use as an argument in google.map.Map()
  var mapOptions = {
    // Give the option that it will zoom at level 12 and give the positon
    zoom: 12,
    center: {lat: 13.73838814025531, lng: 100.65846476556733}
  };

  // Create variable that will init the map (according to google's map api documentation)
  var map = new google.maps.Map(document.getElementById("map"), mapOptions);

  // Create marker point A (at the airport rail link station)
  const markerA = new google.maps.Marker({
    position: {lat: 13.727887576878503, lng: 100.74876762822495},
    map: map,
    label: "A",
  });

  // Create marker point B (at the siam)
  const markerB = new google.maps.Marker({
    position: {lat: 13.74565814886654, lng: 100.53399534975406},
    map: map,
    label: "B",
  });
}

// Declare function that init map for kasetsart u. page
function initMapKaset() {

  // Create variable that will use as an argument in google.map.Map()
  var mapOptions = {
    // Give the option that it will zoom at level 12 and give the positon
    zoom: 12,
    center: {lat: 13.73838814025531, lng: 100.65846476556733}
  };

  // Create variable that will init the map (according to google's map api documentation)
  var map = new google.maps.Map(document.getElementById("map"), mapOptions);

  // Create marker point A (at the airport rail link station)
  const markerA = new google.maps.Marker({
    position: {lat: 13.727887576878503, lng: 100.74876762822495},
    map: map,
    label: "A",
  });

  // Create marker point B (at the kasetsart u.)
  const markerB = new google.maps.Marker({
    position: {lat: 13.847452017051491, lng: 100.56966002561873},
    map: map,
    label: "B",
  });
}

// Declare function that init map for benchakitti park page
function initMapBencha() {

  // Create variable that will use as an argument in google.map.Map()
  var mapOptions = {
    zoom: 12,
    center: {lat: 13.73838814025531, lng: 100.65846476556733}
  };

  // Create variable that will init the map (according to google's map api documentation)
  var map = new google.maps.Map(document.getElementById('map'), mapOptions);

  // Create marker point A (at the airport rail link station)
  const markerA = new google.maps.Marker({
    position: {lat: 13.727887576878503, lng: 100.74876762822495},
    map: map,
    label: "A",
  });

  // Create marker point B (at the benchakitti park)
  const markerB = new google.maps.Marker({
    position: {lat: 13.729372317201905, lng: 100.55839766835432},
    map: map,
    label: "B",
  });
}