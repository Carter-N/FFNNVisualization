importScripts("http://cdnjs.cloudflare.com/ajax/libs/mathjs/3.2.1/math.min.js");  

var x = [
	[0, 0, 1],
	[0, 1, 1],
	[1, 0, 1],
	[1, 1, 1]
];

var y = [
	[0, 1, 1, 0]
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
var w1 =randomWeights(labels.size()[0], labels.size()[1]);

//training iterations
var iterations =  60000;

//Current output of network
var out = null;

//Error data
var errorSamples = 40;
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
		var currentError = calculateTotalError(l2Error);
		postMessage({
			type: "error sample",
			currentError: currentError
		});
		errorData.push(currentError);
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

postMessage({
	type: "finished",
	errorData: errorData,
	iterations: iterations
});

var predict = function(input){

	var prediction = math.multiply(input, w0).map(function(value, index, matrix){
		return sigmoid(value);	
	});

	return Math.round(prediction._data[0]);
};