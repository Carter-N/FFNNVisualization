//network worker
/*var start = new Date().getTime();
console.log(start);
var worker = new Worker("worker.js");

var iterations = null;
var errorData = [];

worker.onmessage = function(e){
	if(e.data.type = "error sample"){
		console.log(e.data.currentError);
	}

	if(e.data.type == "finished"){
		var end = new Date().getTime();

		errorData = e.data.errorData;
		iterations = e.data.iterations;
		console.log(end);

		createChart();
	}
};*/

var generateBinaryScatter = function(samples){
		
	var data;
	var labels;

	return {
		data: data,
		labels: labels
	};
};

//importScripts("http://cdnjs.cloudflare.com/ajax/libs/mathjs/3.2.1/math.min.js");  
var x = [
	
];

var y = [
	
];

//input data
var data = math.matrix(x);

//input data labels
var labels = math.transpose(math.matrix(y));

var randomWeights = function(w, h){
	var weights = math.ones(w, h);
	return weights.map(function(value, index, matrix){
		return Math.random();
	});
};

//first layer of weights
var w0 = randomWeights(data.size()[1], data.size()[0]);

//second layer of weights
var w1 = randomWeights(labels.size()[0], labels.size()[1]);

//training iterations
var iterations =  40000;

//Current output of network
var out = null;

//Error data
var samples = 0;
var errorSamples = 160;
var collectionInterval = iterations / errorSamples;
var errorData = [];

//sigmoid transfer function
var sigmoid = function(x){
	return 1 / (1 + Math.pow(Math.E, -x));
};	

//derivitave of sigmoid transfer function
var sigmoidPrime = function(x){
	return x * (1 - x);
};

var calculateTotalError = function(errorMatrix){

	var count = 0;
	var sum = errorMatrix.map(function(value, index, matrix){
		count += Math.abs(value);
		return value;
	});

	return count / (errorMatrix.size()[0] * errorMatrix.size()[1]);
};

var start = new Date().getTime();

for(var i = 0; i < iterations; i++){

	//input layer
	var l0 = data;

	//hidden layer		
	var l1 = math.multiply(l0, w0).map(function(value, index, matrix){
		return sigmoid(value);	
	});

	//output layer
	var l2 = math.multiply(l1, w1).map(function(value, index, matrix){
		return sigmoid(value);
	});

	out = l2;
	
	//hidden layer error and gradient
	var l2Error = math.subtract(labels, l2);

	if(i % collectionInterval == 0){
		samples++;
		var currentError = calculateTotalError(l2Error);
		/*postMessage({
			type: "error sample",
			currentError: currentError
		});*/

		if(i % (collectionInterval * 10) == 0){
			console.log(currentError);
		}

		if(samples != 1){
			errorData.push(currentError);
		}
	}

	//error gradient
	var l2Delta = math.dotMultiply(l2Error, l2.map(function(value, index, matrix){
		return sigmoidPrime(value);
	}));

	//output layer error and gradient
	var l1Error = math.multiply(l2Delta, math.transpose(w1));

	//error gradient
	var l1Delta = math.dotMultiply(l1Error, l1.map(function(value, index, matrix){
		return sigmoidPrime(value);
	}));

	//train weights
	w1 = math.add(w1, math.multiply(math.transpose(l1), l2Delta));
	w0 = math.add(w0, math.multiply(math.transpose(l0), l1Delta));
}

var end = new Date().getTime();

/*postMessage({
	type: "finished",
	errorData: errorData,
	iterations: iterations
});*/

var predict = function(input){

	var prediction = math.multiply(input, w0).map(function(value, index, matrix){
		return sigmoid(value);	
	});

	return Math.round(prediction._data[0]);
};

console.log((end - start) + "ms");
createChart();
createNet([3, 3, 1]);
