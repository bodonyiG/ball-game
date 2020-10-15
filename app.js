const canvas = document.querySelector('canvas');
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const center = {
  x:canvas.width / 2,
  y:canvas.height / 2
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

const player = new Player(center.x, center.y, 25, "red");

const projectiles =[];
const enemies = [];

function spawnEnemies(){
  setInterval(() => {
    const radius = Math.random() *(30-4)+4;
    let x;
    let y;
    if(Math.random() < .5){
       x = Math.random()<.5 ? 0-radius : canvas.width+radius;
       y = Math.random()*canvas.height;
    }else{
      x= Math.random()*canvas.width;
      y = Math.random()<.5 ? 0-radius : canvas.height+radius;
    }
    const color = "green";
    const angle = Math.atan2(center.y-y, center.x-x);
    const velocity = {
      x:Math.cos(angle),
      y:Math.sin(angle)
    };
    enemies.push(new Enemy(x,y,radius, color, velocity));
  }, 1000);


}

let animationID;
function animate() {
  animationID = window.requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  player.draw();
    projectiles.forEach(projectile =>{
      projectile.update();
    });
    enemies.forEach((enemy, eIndex)=>{
      enemy.update();
      const dist = Math.hypot(player.x-enemy.x, player.y-enemy.y);
      if(dist - (enemy.radius + player.radius) < 1){
        //endgame
         cancelAnimationFrame(animationID);
      }

      projectiles.forEach((projectile, pIndex) => {
        const hit = projectile.radius/2 + enemy.radius/2;
        const dist = Math.hypot(projectile.x-enemy.x, projectile.y-enemy.y);
        if(dist - enemy.radius - projectile.radius < 1){
          setTimeout(() => {
            enemies.splice(eIndex,1);
            projectiles.splice(pIndex,1);
          },0);

        }
      });

    })
}


window.addEventListener("click", function(event) {
  const angle = Math.atan2(event.clientY-center.y, event.clientX-center.x);
  const velocity = {
    x:Math.cos(angle),
    y:Math.sin(angle)
  };

  projectiles.push(new Projectile(
    center.x,
    center.y,
    5,
    "blue",
    velocity
  ));

});

animate();
spawnEnemies();
