const DEFAULT_SPACE = 2

const stringifyVNode = (vnode, space) => {
    const current_space = space === undefined ? 0 : (space + DEFAULT_SPACE)
    const spaces = " ".repeat(current_space)
    if (typeof vnode.type === "symbol") { return vnode.children }

    const tag = vnode.type;
    let children = codeHtml.defineChildrenVnode(vnode.children, current_space)
    
    if (tag === 'scriptBalise') {
        children = codeHtml.formatScriptContent(children, current_space)
    }
    
    const props = codeHtml.stringifyAttributes(vnode.props)
    if(codeHtml.isSelfClosing(tag, children)) { return codeHtml.formatSelfClosingTag(tag, props, current_space) }

    return `${spaces}<${tag}${props}>${codeHtml.formatChildrenContent(children, spaces)}</${tag}>`;
}

const formatChildrenContent = (children_content, spaces) => {
    if(children_content === "") { return "" }
    return `\n${children_content}\n${spaces}`
}

const defineChildrenVnode = (children, current_space) => {
    if(children === null) { return '' }
    if(typeof children !== "string") { return children.map(children => codeHtml.stringifyVNode(children, current_space)).join("\n") }
    return " ".repeat(current_space + DEFAULT_SPACE) + children.replaceAll('\n', "\n" + " ".repeat(current_space + DEFAULT_SPACE))
}

const stringifyAttributes = attributes => {
    if(!attributes) { return "" }

    return " " + Object.entries(attributes)
            .map(([key, value]) => {
                if (typeof value === "object") { return codeHtml.stringifyObjectAttributes(key, value) }
                return value === "" ? key : `${key}="${value}"`
            })
            .join(" ")
}

const stringifyObjectAttributes = (key, value) => {
    const styleString = Object.entries(value)
    .map(([property, value]) => `${property}:${value};`)
    .join(" ");

  return `${key}="${styleString}"`;
}

const selfTags = new Set(["img", "input", "br", "hr", "meta", "link"]);
const isSelfClosing = (tag, children) => {
    //si le tag fait partie des tags selfclose ou que c'est un tag custom commençant par un majuscule et sans enfant
    return selfTags.has(tag.toLowerCase()) || (tag.charAt(0).toUpperCase() === tag.charAt(0) && children === "")
}

const formatSelfClosingTag = (tag, props, current_space) => {
    props = props.replaceAll(" ", "\n" + " ".repeat(current_space + DEFAULT_SPACE));
    return `${" ".repeat(current_space)}<${tag}${props}\n${" ".repeat(current_space)}/>`;
}

const formatScriptContent = (content, current_space) => {
    let formattedContent = content;
    
    formattedContent = formattedContent.replaceAll('; ', ';\n' + " ".repeat(current_space + DEFAULT_SPACE));
    formattedContent = formattedContent.replaceAll(/;([a-zA-Z])/g, ';\n' + " ".repeat(current_space + DEFAULT_SPACE) + '$1');
    
    return formattedContent;
}

export const codeHtml = { 
    stringifyVNode, 
    formatChildrenContent, 
    defineChildrenVnode, 
    stringifyAttributes, 
    isSelfClosing, 
    formatSelfClosingTag, 
    formatScriptContent,
    stringifyObjectAttributes 
}
