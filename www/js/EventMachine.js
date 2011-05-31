//EventMachine
(function () {
	var rz = window._rz_;
	if (!rz || rz.EventMachine) return false;
	
	function EventMachine (opt) {
		this._opt = opt || {};
	};
	
	//Publish msg
	EventMachine.prototype.pub = function (name, data) {
	};
	
	//Subscribe
	EventMachine.prototype.sub = function (name, callback) {
	};
	
	rz.EventMachine = EventMachine;
	rz.scriptLoaded('EventMachine');
})();