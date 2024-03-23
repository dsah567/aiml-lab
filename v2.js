const POPULATION_SIZE = 300;

let sub = [];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}



// { "cs11": "3", "cs12": "7", "cs13": "9", "cs14": "5" }
// { "cs21": "7", "cs22": "7", "cs23": "5", "cs24": "5" }
// { "cs31": "7", "cs32": "7", "cs33": "5", "cs34": "5" }

// { "cs11": "3"}
// { "cs21": "7"}
// { "cs31": "7"}
//returns array of classes
function classes() {
  let classes1 = {
    subjectID: { cs11: 3, cs12: 7, cs13: 9, cs14: 5 },
    timetable: [[], [], [], [], [], []],
  };
  let classes2 = {
    subjectID: { cs21: 7, cs22: 7, cs23: 5, cs24: 5 },
    timetable: [[], [], [], [], [], []],
  };
  let classes3 = {
    subjectID: { cs31: 7, cs32: 7, cs33: 5, cs34: 5 },
    timetable: [[], [], [], [], [], []],
  };

  let classes = [classes1, classes2, classes3];
  return classes;
}
//console.log(classes());

//returns object of teacher
function teachers() {
  let teacherID = {
    cs11: "t1", cs12: "t3", cs13: "t2", cs14: "t2",
    cs21: "t1", cs22: "t2", cs23: "t3", cs24: "t3",
    cs31: "t2", cs32: "t3", cs33: "t1", cs34: "t1"
    // t1: ["cs11", "cs21", "cs33", "cs34"],
    // t2: ["cs22", "cs31", "cs13", "cs14"],
    // t3: ["cs12", "cs32", "cs23", "cs24"],
  };

  return teacherID;
}
//console.log(teachers());

//subjectID of specific classes
function totPeriods(classes, k) {
  this.classes = classes;
  return Object.keys(this.classes[k].subjectID);
}

//count no of occurances of a string in an array
function countOccurrences(array, targetString) {
  let arr= array.flat(Infinity)
  const count = arr.reduce((acc, currentValue) => {
    return acc + (currentValue === targetString ? 1 : 0);
  }, 0);

  return count;
}

//fill the timetable of a specific classes with random values from sub
function timetabArragne(classes, i) {
  this.classes = classes;
  for (let k = 0; k < classes[i].timetable.length; k++) {
    for (let j = 0; j < 4; j++) {
      this.classes[i].timetable[k].push(sub[i][getRandomInt(0, 3)]);
    }
  }
}

//fill and return  timetable of classes and also fill sub
function timetable() {
  this.classes = classes();
  for (let i = 0; i < this.classes.length; i++) {
    sub.push(totPeriods(this.classes, i));
    timetabArragne(this.classes, i);
  }
  return this.classes
}

function display(classes) {
  this.classes = classes;
  console.log(sub);
  for (let i = 0; i <this.classes.length; i++) {
    console.log(this.classes[i].timetable);
  }
}
// let a = timetable()
// console.log(display(a));


class Individual {
  constructor(classes) {
    this.classes=classes
    this.teacherID=teachers()
    this.Fitness=this.calcFitness();
  }

  calcFitness() {
    let fittness = 0;
    for (let i = 0; i < this.classes.length; i++) {
      let a = Object.keys(this.classes[i].subjectID);
      let b = Object.values(this.classes[i].subjectID);

      for (let j = 0; j < a.length; j++) {
        let c = countOccurrences(this.classes[i].timetable,a[j]);
        if (c != b[j]) {
          fittness++;
        }
      }
    }
    for (let i = 0; i < this.classes.length - 1; i++) {
      for (let j = 0; j < this.classes[i].timetable.length; j++) {
        for (let k = 0; k < this.classes[i].timetable[j].length; k++) {
          for (let x = 0; x < this.classes.length - i; x++) {
            if (
              this.teacherID[this.classes[i].timetable[j][k]] ==
              this.teacherID[this.classes[i + 1 ].timetable[j][k]]
            ) {
              fittness++;
            }
          }
        }
      }
    }
    return fittness;
  }
  
  Mate(p2){
    let childClasses = classes();
		for (let i = 0; i < this.classes.length; i++) {
      for (let k = 0; k < this.classes[i].timetable.length; k++) {
        for (let j = 0; j < this.classes[i].timetable[k].length; j++) {
          let p = Math.random();
          if (p < 0.45)
            childClasses[i].timetable[k].push(this.classes[i].timetable[k][j]) 
          else if (p < 0.90)
            childClasses[i].timetable[k].push(p2.classes[i].timetable[k][j]) 
          else
            childClasses[i].timetable[k].push(sub[i][getRandomInt(0, 3)]);
        }
      }
		}
		return new Individual(childClasses);
  }
}

class FitnessComparer {
	static Compare(ind1, ind2) {
		return ind1.Fitness - ind2.Fitness;
	}
}

function Main() {
	// current generation
	let generation = 0;
  this.classes=timetable()

	let population = [];
	let found = false;

	// create initial population
	for (let i = 0; i < POPULATION_SIZE; i++) {
		population.push(new Individual(this.classes));
	}

	while (!found) {
		// sort the population in increasing order of fitness score
		population.sort((a, b) => FitnessComparer.Compare(a, b));

		// if the individual having lowest fitness score ie. 
		// 0 then we know that we have reached the target
		// and break the loop
		if (population[0].Fitness === 0) {
      console.log("Generation: " + generation + "\t" +"Fitness: " + population[0].Fitness);
       display(population[0].classes)
			found = true;
			break;
		}

		// Otherwise generate new offsprings for new generation
		let newGeneration = [];

		// Perform Elitism, that means 10% of fittest population
		// goes to the next generation
		let s = Math.floor((10 * POPULATION_SIZE) / 100);
		for (let i = 0; i < s; i++)
			newGeneration.push(population[i]);

		// From 50% of fittest population, Individuals
		// will mate to produce offspring
		s = Math.floor((90 * POPULATION_SIZE) / 100);
		for (let i = 0; i < s; i++) {
			let r = getRandomInt(0, 50);
			let parent1 = population[r];
			r = getRandomInt(0, 50);
			let parent2 = population[r];
			let offspring = parent1.Mate(parent2);
			newGeneration.push(offspring);
		}
		population = newGeneration;
		console.log("Generation: " + generation + "\t" +"Fitness: " + population[0].Fitness);
		generation++;
	}
}

Main()