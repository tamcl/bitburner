/** @param {NS} ns **/
var printer = false;
var ignore_server = ['home'];
var character = 15;
var hack_target = [];


function keyword_format(word){
	var output = word.slice() + ' ';
	var repeating = character - output.length - 3;
	for (var i = 0; repeating > i; ++i){
		output = output + ' ';
	}
	output = output + '--- ';
	return output;

}

function openPorts(ns, input_server) {
	var open_ports = 0
	if (ns.fileExists('BruteSSH.exe', 'home')) {
		open_ports++;
		ns.brutessh(input_server);
	}
	if (ns.fileExists('FTPCrack.exe', 'home')) {
		open_ports++;
		ns.ftpcrack(input_server);
	}
	if (ns.fileExists('relaySMTP.exe', 'home')) {
		open_ports++;
		ns.relaysmtp(input_server);
	}
	if (ns.fileExists('HTTPWorm.exe', 'home')) {
		open_ports++;
		ns.httpworm(input_server);
	}
	if (ns.fileExists('SQLInject.exe', 'home')) {
		open_ports++;
		ns.sqlinject(input_server);
	}
	return open_ports;
}

async function scanner(ns, scan_server,  public_server_list, path ){
	

	if (printer){
		var keyword = 'SCAN';
		ns.tprint(keyword_format(keyword) + scan_server);
	}

	var local_server_list = ns.scan(scan_server);
	var add_list = [];

	if (printer){
		var keyword = 'UPDATE';
		ns.tprint(keyword_format(keyword) + local_server_list);
	}

	for (var i = 0; local_server_list.length > i; ++i) {
		if (public_server_list.includes(local_server_list[i])) {
			if (printer){
				var keyword = 'EXISTS';
				ns.tprint(keyword_format(keyword) + local_server_list);
			}
		} else {
			if (printer){
				var keyword = 'NEW';
				ns.tprint(keyword_format(keyword) + local_server_list);
			}

			if (printer){
				var keyword = 'HACKLEVEL';
				ns.tprint(keyword_format(keyword) + ns.getServerRequiredHackingLevel(local_server_list[i]));
			}

			if (printer){
				var keyword = 'MAXMONEY';
				ns.tprint(keyword_format(keyword) + ns.getServerMaxMoney(local_server_list[i]));
			}

			if (printer){
				var keyword = 'PATH';
				ns.tprint(keyword_format(keyword) + path.join(' -> '));
			}
			
			if (ns.getHackingLevel() > ns.getServerRequiredHackingLevel(local_server_list[i]) & ns.getServerMaxMoney(local_server_list[i]) > 0){
				hack_target.push(local_server_list[i]);
			}

			add_list.push(local_server_list[i]);
			if (!ignore_server.includes(local_server_list[i])) {
				if (openPorts(ns, local_server_list[i]) >= ns.getServerNumPortsRequired(local_server_list[i])) {
					// ns.tprint('NUKE   --- ' + 'RESULTS: ' + nuke(local_server_list[i]) + " (" + local_server_list[i] + ")")
					if (printer){
						var keyword = 'NUKE';
						var nuke_result = await ns.nuke(local_server_list[i]);
						ns.tprint(keyword_format(keyword) + 'RESULTS: ' + nuke_result + " (" + local_server_list[i] + ")");
					}
				} else {
					ns.tprint('NUKE   --- ' + 'RESULTS: ' + "false" + " (Requires more ports)");
				}
			}
		}
	}
	public_server_list = public_server_list.concat(add_list);

	// tprint('update list ' + public_server_list);

	for (var i = 0; add_list.length > i; ++i) {
		var temp_path = path.slice();
		temp_path.push(add_list[i]);
		public_server_list = await scanner(ns, add_list[i], public_server_list, temp_path);
	}

	return public_server_list
}

async function arrangeHack(ns, hRam, wRam, gRam){

}



export async function main(ns) {
	var server_list = await scanner(ns,'home', ['home'], ['home'] );
	ns.tprint(server_list);
	ns.tprint(hack_target);
	var hack_ram = ns.getScriptRam('hack.script');
	var weaken_ram = ns.getScriptRam('weaken.script');
	var grow_ram = ns.getScriptRam('grow.script');
}
