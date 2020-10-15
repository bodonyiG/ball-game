const canvas = document.querySelector('canvas');
const c = canvas.getContext("2d");
const scoreEnd = document.querySelector("#scoreEnd");
const scoreGame = document.querySelector("#scoreGame");
const endTable = document.querySelector(".end-title");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const center = {
  x: canvas.width / 2,
  y: canvas.height / 2
}


class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
}

class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }

}

class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }

}

const friction = .98;
class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }
  draw() {
    c.save();
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.restore();
  }

  update() {
    this.draw();
    this.velocity.x *= friction;
    this.velocity.y *= friction;

    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.alpha -= 0.01;
  }

}

const player = new Player(center.x, center.y, 25, "white");

const projectiles = [];
const enemies = [];
const particles = [];

function spawnEnemies() {
  setInterval(() => {
    const radius = Math.random() * (30 - 4) + 4;
    let x;
    let y;
    if (Math.random() < .5) {
      x = Math.random() < .5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < .5 ? 0 - radius : canvas.height + radius;
    }
    const color = ` hsl(${Math.random()*360},50%, 50%)`;
    const angle = Math.atan2(center.y - y, center.x - x);
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle)
    };
    enemies.push(new Enemy(x, y, radius, color, velocity));
  }, 1000);


}

let animationID;
let score = 0;
c.fillStyle = "black";
c.fillRect(0, 0, canvas.width, canvas.height);


// ANIMATE ------------------------------------------------------------------------
function animate() {
  animationID = window.requestAnimationFrame(animate);
  // c.clearRect(0, 0, canvas.width, canvas.height);  //clearing
  c.fillStyle = "rgba(0,0,0, .1)";
  c.fillRect(0, 0, canvas.width, canvas.height); //clearing
  player.draw();

  // Render particles
  particles.forEach((particle, index) => {

    if(particle.alpha <= 0){
      particles.splice(index,1);
    }else{
      particle.update();
    }
  })

  //Delete projectile if outside
  projectiles.forEach((projectile, pIndex) => {
    projectile.update();
    if (projectile.x - projectile.radius < 0 || projectile.x + projectile.radius > canvas.width) {
      setTimeout(() => {
        projectiles.splice(pIndex, 1);
      });
    }
  });


  enemies.forEach((enemy, eIndex) => {
    enemy.update();
    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    if (dist - (enemy.radius + player.radius) < 1) {
      //endgame
      cancelAnimationFrame(animationID);
      scoreEnd.innerHTML = score
      endTable.style.display = "flex";
      score = 0;
    }
    //Projectile loop
    projectiles.forEach((projectile, pIndex) => {
      const hit = projectile.radius / 2 + enemy.radius / 2;
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

      //When projectile touch enemy
      if (dist - enemy.radius - projectile.radius < 1) {

        //Creating EXPLOSION PARTICLES
        for(i=0; i< enemy.radius; i++){
          particles.push(new Particle(
            projectile.x,
             projectile.y,
             Math.random()*(3-1)+1,
             enemy.color,
             {
               x: (Math.random()-.5)*7*Math.random(),
               y:(Math.random()-.5)*7*Math.random()
             }
           ));
        }

        if (enemy.radius - 10 > 10) {
          score += 100;
          scoreGame.innerHTML = score;

          gsap.to(enemy, {
            radius: enemy.radius - 10
          });

          setTimeout(() => {
            projectiles.splice(pIndex, 1);
          }, 0);
        } else {
          score += 250;
          scoreGame.innerHTML = score

          setTimeout(() => {
            enemies.splice(eIndex, 1);
            projectiles.splice(pIndex, 1);
          }, 0);

        }

      }
    });

  })
}


window.addEventListener("click", function(event) {
  // console.log(projectiles);
  const angle = Math.atan2(event.clientY - center.y, event.clientX - center.x);
  const velocity = {
    x: Math.cos(angle) * 6,
    y: Math.sin(angle) * 6
  };

  projectiles.push(new Projectile(
    center.x,
    center.y,
    5,
    "white",
    velocity
  ));

});





animate();
spawnEnemies();


// function shrink(object, key) {
//
//   let targetValues = Object.keys(key).length;
//
//
//
//   console.log(key.length);
//   let myVar = setInterval(function() {
//     if (nr > 0) {
//       nr -= 1;
//       console.log(nr);
//     } else {
//       clearInterval( myVar);
//     }
//   }, 0);
// }
