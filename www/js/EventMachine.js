//EventMachine
(function () {
	var rz = window._rz_;
	if (!rz || rz.EventMachine) return false;
	
	function EventMachine () {};

	rz.scriptLoaded('EventMachine');
})();