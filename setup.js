

/** @param {NS} ns **/
export async function main(ns) {
    var url_scripts = [];
    var target_server = ns.hostname();

    for (var i = 0; url_scripts.length > i; ++i){
      ns.wget(url_scripts[i], target_server);
    }
    ns.sleep(5000);
    ns.run('main.js',1);
}
