const utils = require('../../utils');

function installRule(markdownIt, mdOptions, ruleOptions) {
	const defaultRender = markdownIt.renderer.rules.link_open;

	markdownIt.renderer.rules.link_open = (tokens, idx, options, env, self) => {
		const Resource = ruleOptions.ResourceModel;

		const token = tokens[idx];
		const src = utils.getAttr(token.attrs, 'href');

		if (!Resource.isResourceUrl(src) || ruleOptions.plainResourceRendering) return defaultRender(tokens, idx, options, env, self);

		const r = utils.resourceReplacement(ruleOptions.ResourceModel, src, ruleOptions.resources, ruleOptions.resourceBaseUrl);
		if (typeof r === 'string') return r;

		// if (r) return `<video controls><source src='${r.src}'></video><a href=# onclick=ipcProxySendToHost('joplin://${src.substring(2)}')>`;
		if (r && r.type === 'video') return `<video style="width:100%" controls><source src='${r.src}'></video>`;
		return defaultRender(tokens, idx, options, env, self);
	};
}

module.exports = {
	install: function(context, ruleOptions) {
		return function(md, mdOptions) {
			installRule(md, mdOptions, ruleOptions);
		};
	},
};
