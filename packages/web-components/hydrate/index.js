'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*!
 Stencil Mock Doc v4.12.1 | MIT Licensed | https://stenciljs.com
 */
const CONTENT_REF_ID = 'r';
const ORG_LOCATION_ID = 'o';
const SLOT_NODE_ID = 's';
const TEXT_NODE_ID = 't';
const XLINK_NS = 'http://www.w3.org/1999/xlink';

const attrHandler = {
    get(obj, prop) {
        if (prop in obj) {
            return obj[prop];
        }
        if (typeof prop !== 'symbol' && !isNaN(prop)) {
            return obj.__items[prop];
        }
        return undefined;
    },
};
const createAttributeProxy = (caseInsensitive) => new Proxy(new MockAttributeMap(caseInsensitive), attrHandler);
class MockAttributeMap {
    constructor(caseInsensitive = false) {
        this.caseInsensitive = caseInsensitive;
        this.__items = [];
    }
    get length() {
        return this.__items.length;
    }
    item(index) {
        return this.__items[index] || null;
    }
    setNamedItem(attr) {
        attr.namespaceURI = null;
        this.setNamedItemNS(attr);
    }
    setNamedItemNS(attr) {
        if (attr != null && attr.value != null) {
            attr.value = String(attr.value);
        }
        const existingAttr = this.__items.find((a) => a.name === attr.name && a.namespaceURI === attr.namespaceURI);
        if (existingAttr != null) {
            existingAttr.value = attr.value;
        }
        else {
            this.__items.push(attr);
        }
    }
    getNamedItem(attrName) {
        if (this.caseInsensitive) {
            attrName = attrName.toLowerCase();
        }
        return this.getNamedItemNS(null, attrName);
    }
    getNamedItemNS(namespaceURI, attrName) {
        namespaceURI = getNamespaceURI(namespaceURI);
        return (this.__items.find((attr) => attr.name === attrName && getNamespaceURI(attr.namespaceURI) === namespaceURI) || null);
    }
    removeNamedItem(attr) {
        this.removeNamedItemNS(attr);
    }
    removeNamedItemNS(attr) {
        for (let i = 0, ii = this.__items.length; i < ii; i++) {
            if (this.__items[i].name === attr.name && this.__items[i].namespaceURI === attr.namespaceURI) {
                this.__items.splice(i, 1);
                break;
            }
        }
    }
    [Symbol.iterator]() {
        let i = 0;
        return {
            next: () => ({
                done: i === this.length,
                value: this.item(i++),
            }),
        };
    }
    get [Symbol.toStringTag]() {
        return 'MockAttributeMap';
    }
}
function getNamespaceURI(namespaceURI) {
    return namespaceURI === XLINK_NS ? null : namespaceURI;
}
function cloneAttributes(srcAttrs, sortByName = false) {
    const dstAttrs = new MockAttributeMap(srcAttrs.caseInsensitive);
    if (srcAttrs != null) {
        const attrLen = srcAttrs.length;
        if (sortByName && attrLen > 1) {
            const sortedAttrs = [];
            for (let i = 0; i < attrLen; i++) {
                const srcAttr = srcAttrs.item(i);
                const dstAttr = new MockAttr(srcAttr.name, srcAttr.value, srcAttr.namespaceURI);
                sortedAttrs.push(dstAttr);
            }
            sortedAttrs.sort(sortAttributes).forEach((attr) => {
                dstAttrs.setNamedItemNS(attr);
            });
        }
        else {
            for (let i = 0; i < attrLen; i++) {
                const srcAttr = srcAttrs.item(i);
                const dstAttr = new MockAttr(srcAttr.name, srcAttr.value, srcAttr.namespaceURI);
                dstAttrs.setNamedItemNS(dstAttr);
            }
        }
    }
    return dstAttrs;
}
function sortAttributes(a, b) {
    if (a.name < b.name)
        return -1;
    if (a.name > b.name)
        return 1;
    return 0;
}
class MockAttr {
    constructor(attrName, attrValue, namespaceURI = null) {
        this._name = attrName;
        this._value = String(attrValue);
        this._namespaceURI = namespaceURI;
    }
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = String(value);
    }
    get nodeName() {
        return this._name;
    }
    set nodeName(value) {
        this._name = value;
    }
    get nodeValue() {
        return this._value;
    }
    set nodeValue(value) {
        this._value = String(value);
    }
    get namespaceURI() {
        return this._namespaceURI;
    }
    set namespaceURI(namespaceURI) {
        this._namespaceURI = namespaceURI;
    }
}

class MockClassList {
    constructor(elm) {
        this.elm = elm;
    }
    add(...classNames) {
        const clsNames = getItems(this.elm);
        let updated = false;
        classNames.forEach((className) => {
            className = String(className);
            validateClass(className);
            if (clsNames.includes(className) === false) {
                clsNames.push(className);
                updated = true;
            }
        });
        if (updated) {
            this.elm.setAttributeNS(null, 'class', clsNames.join(' '));
        }
    }
    remove(...classNames) {
        const clsNames = getItems(this.elm);
        let updated = false;
        classNames.forEach((className) => {
            className = String(className);
            validateClass(className);
            const index = clsNames.indexOf(className);
            if (index > -1) {
                clsNames.splice(index, 1);
                updated = true;
            }
        });
        if (updated) {
            this.elm.setAttributeNS(null, 'class', clsNames.filter((c) => c.length > 0).join(' '));
        }
    }
    contains(className) {
        className = String(className);
        return getItems(this.elm).includes(className);
    }
    toggle(className) {
        className = String(className);
        if (this.contains(className) === true) {
            this.remove(className);
        }
        else {
            this.add(className);
        }
    }
    get length() {
        return getItems(this.elm).length;
    }
    item(index) {
        return getItems(this.elm)[index];
    }
    toString() {
        return getItems(this.elm).join(' ');
    }
}
function validateClass(className) {
    if (className === '') {
        throw new Error('The token provided must not be empty.');
    }
    if (/\s/.test(className)) {
        throw new Error(`The token provided ('${className}') contains HTML space characters, which are not valid in tokens.`);
    }
}
function getItems(elm) {
    const className = elm.getAttribute('class');
    if (typeof className === 'string' && className.length > 0) {
        return className
            .trim()
            .split(' ')
            .filter((c) => c.length > 0);
    }
    return [];
}

class MockCSSStyleDeclaration {
    constructor() {
        this._styles = new Map();
    }
    setProperty(prop, value) {
        prop = jsCaseToCssCase(prop);
        if (value == null || value === '') {
            this._styles.delete(prop);
        }
        else {
            this._styles.set(prop, String(value));
        }
    }
    getPropertyValue(prop) {
        prop = jsCaseToCssCase(prop);
        return String(this._styles.get(prop) || '');
    }
    removeProperty(prop) {
        prop = jsCaseToCssCase(prop);
        this._styles.delete(prop);
    }
    get length() {
        return this._styles.size;
    }
    get cssText() {
        const cssText = [];
        this._styles.forEach((value, prop) => {
            cssText.push(`${prop}: ${value};`);
        });
        return cssText.join(' ').trim();
    }
    set cssText(cssText) {
        if (cssText == null || cssText === '') {
            this._styles.clear();
            return;
        }
        cssText.split(';').forEach((rule) => {
            rule = rule.trim();
            if (rule.length > 0) {
                const splt = rule.split(':');
                if (splt.length > 1) {
                    const prop = splt[0].trim();
                    const value = splt.slice(1).join(':').trim();
                    if (prop !== '' && value !== '') {
                        this._styles.set(jsCaseToCssCase(prop), value);
                    }
                }
            }
        });
    }
}
function createCSSStyleDeclaration() {
    return new Proxy(new MockCSSStyleDeclaration(), cssProxyHandler);
}
const cssProxyHandler = {
    get(cssStyle, prop) {
        if (prop in cssStyle) {
            return cssStyle[prop];
        }
        prop = cssCaseToJsCase(prop);
        return cssStyle.getPropertyValue(prop);
    },
    set(cssStyle, prop, value) {
        if (prop in cssStyle) {
            cssStyle[prop] = value;
        }
        else {
            cssStyle.setProperty(prop, value);
        }
        return true;
    },
};
function cssCaseToJsCase(str) {
    // font-size to fontSize
    if (str.length > 1 && str.includes('-') === true) {
        str = str
            .toLowerCase()
            .split('-')
            .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
            .join('');
        str = str.slice(0, 1).toLowerCase() + str.slice(1);
    }
    return str;
}
function jsCaseToCssCase(str) {
    // fontSize to font-size
    if (str.length > 1 && str.includes('-') === false && /[A-Z]/.test(str) === true) {
        str = str
            .replace(/([A-Z])/g, (g) => ' ' + g[0])
            .trim()
            .replace(/ /g, '-')
            .toLowerCase();
    }
    return str;
}

class MockCustomElementRegistry {
    constructor(win) {
        this.win = win;
    }
    define(tagName, cstr, options) {
        if (tagName.toLowerCase() !== tagName) {
            throw new Error(`Failed to execute 'define' on 'CustomElementRegistry': "${tagName}" is not a valid custom element name`);
        }
        if (this.__registry == null) {
            this.__registry = new Map();
        }
        this.__registry.set(tagName, { cstr, options });
        if (this.__whenDefined != null) {
            const whenDefinedResolveFns = this.__whenDefined.get(tagName);
            if (whenDefinedResolveFns != null) {
                whenDefinedResolveFns.forEach((whenDefinedResolveFn) => {
                    whenDefinedResolveFn();
                });
                whenDefinedResolveFns.length = 0;
                this.__whenDefined.delete(tagName);
            }
        }
        const doc = this.win.document;
        if (doc != null) {
            const hosts = doc.querySelectorAll(tagName);
            hosts.forEach((host) => {
                if (upgradedElements.has(host) === false) {
                    tempDisableCallbacks.add(doc);
                    const upgradedCmp = createCustomElement(this, doc, tagName);
                    for (let i = 0; i < host.childNodes.length; i++) {
                        const childNode = host.childNodes[i];
                        childNode.remove();
                        upgradedCmp.appendChild(childNode);
                    }
                    tempDisableCallbacks.delete(doc);
                    if (proxyElements.has(host)) {
                        proxyElements.set(host, upgradedCmp);
                    }
                }
                fireConnectedCallback(host);
            });
        }
    }
    get(tagName) {
        if (this.__registry != null) {
            const def = this.__registry.get(tagName.toLowerCase());
            if (def != null) {
                return def.cstr;
            }
        }
        return undefined;
    }
    upgrade(_rootNode) {
        //
    }
    clear() {
        if (this.__registry != null) {
            this.__registry.clear();
        }
        if (this.__whenDefined != null) {
            this.__whenDefined.clear();
        }
    }
    whenDefined(tagName) {
        tagName = tagName.toLowerCase();
        if (this.__registry != null && this.__registry.has(tagName) === true) {
            return Promise.resolve(this.__registry.get(tagName).cstr);
        }
        return new Promise((resolve) => {
            if (this.__whenDefined == null) {
                this.__whenDefined = new Map();
            }
            let whenDefinedResolveFns = this.__whenDefined.get(tagName);
            if (whenDefinedResolveFns == null) {
                whenDefinedResolveFns = [];
                this.__whenDefined.set(tagName, whenDefinedResolveFns);
            }
            whenDefinedResolveFns.push(resolve);
        });
    }
}
function createCustomElement(customElements, ownerDocument, tagName) {
    const Cstr = customElements.get(tagName);
    if (Cstr != null) {
        const cmp = new Cstr(ownerDocument);
        cmp.nodeName = tagName.toUpperCase();
        upgradedElements.add(cmp);
        return cmp;
    }
    const host = new Proxy({}, {
        get(obj, prop) {
            const elm = proxyElements.get(host);
            if (elm != null) {
                return elm[prop];
            }
            return obj[prop];
        },
        set(obj, prop, val) {
            const elm = proxyElements.get(host);
            if (elm != null) {
                elm[prop] = val;
            }
            else {
                obj[prop] = val;
            }
            return true;
        },
        has(obj, prop) {
            const elm = proxyElements.get(host);
            if (prop in elm) {
                return true;
            }
            if (prop in obj) {
                return true;
            }
            return false;
        },
    });
    const elm = new MockHTMLElement(ownerDocument, tagName);
    proxyElements.set(host, elm);
    return host;
}
const proxyElements = new WeakMap();
const upgradedElements = new WeakSet();
function connectNode(ownerDocument, node) {
    node.ownerDocument = ownerDocument;
    if (node.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */) {
        if (ownerDocument != null && node.nodeName.includes('-')) {
            const win = ownerDocument.defaultView;
            if (win != null && typeof node.connectedCallback === 'function' && node.isConnected) {
                fireConnectedCallback(node);
            }
            const shadowRoot = node.shadowRoot;
            if (shadowRoot != null) {
                shadowRoot.childNodes.forEach((childNode) => {
                    connectNode(ownerDocument, childNode);
                });
            }
        }
        node.childNodes.forEach((childNode) => {
            connectNode(ownerDocument, childNode);
        });
    }
    else {
        node.childNodes.forEach((childNode) => {
            childNode.ownerDocument = ownerDocument;
        });
    }
}
function fireConnectedCallback(node) {
    if (typeof node.connectedCallback === 'function') {
        if (tempDisableCallbacks.has(node.ownerDocument) === false) {
            try {
                node.connectedCallback();
            }
            catch (e) {
                console.error(e);
            }
        }
    }
}
function disconnectNode(node) {
    if (node.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */) {
        if (node.nodeName.includes('-') === true && typeof node.disconnectedCallback === 'function') {
            if (tempDisableCallbacks.has(node.ownerDocument) === false) {
                try {
                    node.disconnectedCallback();
                }
                catch (e) {
                    console.error(e);
                }
            }
        }
        node.childNodes.forEach(disconnectNode);
    }
}
function attributeChanged(node, attrName, oldValue, newValue) {
    attrName = attrName.toLowerCase();
    const observedAttributes = node.constructor.observedAttributes;
    if (Array.isArray(observedAttributes) === true &&
        observedAttributes.some((obs) => obs.toLowerCase() === attrName) === true) {
        try {
            node.attributeChangedCallback(attrName, oldValue, newValue);
        }
        catch (e) {
            console.error(e);
        }
    }
}
function checkAttributeChanged(node) {
    return node.nodeName.includes('-') === true && typeof node.attributeChangedCallback === 'function';
}
const tempDisableCallbacks = new Set();

function dataset(elm) {
    const ds = {};
    const attributes = elm.attributes;
    const attrLen = attributes.length;
    for (let i = 0; i < attrLen; i++) {
        const attr = attributes.item(i);
        const nodeName = attr.nodeName;
        if (nodeName.startsWith('data-')) {
            ds[dashToPascalCase(nodeName)] = attr.nodeValue;
        }
    }
    return new Proxy(ds, {
        get(_obj, camelCaseProp) {
            return ds[camelCaseProp];
        },
        set(_obj, camelCaseProp, value) {
            const dataAttr = toDataAttribute(camelCaseProp);
            elm.setAttribute(dataAttr, value);
            return true;
        },
    });
}
function toDataAttribute(str) {
    return ('data-' +
        String(str)
            .replace(/([A-Z0-9])/g, (g) => ' ' + g[0])
            .trim()
            .replace(/ /g, '-')
            .toLowerCase());
}
function dashToPascalCase(str) {
    str = String(str).slice(5);
    return str
        .split('-')
        .map((segment, index) => {
        if (index === 0) {
            return segment.charAt(0).toLowerCase() + segment.slice(1);
        }
        return segment.charAt(0).toUpperCase() + segment.slice(1);
    })
        .join('');
}

class MockEvent {
    constructor(type, eventInitDict) {
        this.bubbles = false;
        this.cancelBubble = false;
        this.cancelable = false;
        this.composed = false;
        this.currentTarget = null;
        this.defaultPrevented = false;
        this.srcElement = null;
        this.target = null;
        if (typeof type !== 'string') {
            throw new Error(`Event type required`);
        }
        this.type = type;
        this.timeStamp = Date.now();
        if (eventInitDict != null) {
            Object.assign(this, eventInitDict);
        }
    }
    preventDefault() {
        this.defaultPrevented = true;
    }
    stopPropagation() {
        this.cancelBubble = true;
    }
    stopImmediatePropagation() {
        this.cancelBubble = true;
    }
    composedPath() {
        const composedPath = [];
        let currentElement = this.target;
        while (currentElement) {
            composedPath.push(currentElement);
            if (!currentElement.parentElement && currentElement.nodeName === "#document" /* NODE_NAMES.DOCUMENT_NODE */) {
                // the current element doesn't have a parent, but we've detected it's our root document node. push the window
                // object associated with the document onto the path
                composedPath.push(currentElement.defaultView);
                break;
            }
            currentElement = currentElement.parentElement;
        }
        return composedPath;
    }
}
class MockCustomEvent extends MockEvent {
    constructor(type, customEventInitDic) {
        super(type);
        this.detail = null;
        if (customEventInitDic != null) {
            Object.assign(this, customEventInitDic);
        }
    }
}
class MockKeyboardEvent extends MockEvent {
    constructor(type, keyboardEventInitDic) {
        super(type);
        this.code = '';
        this.key = '';
        this.altKey = false;
        this.ctrlKey = false;
        this.metaKey = false;
        this.shiftKey = false;
        this.location = 0;
        this.repeat = false;
        if (keyboardEventInitDic != null) {
            Object.assign(this, keyboardEventInitDic);
        }
    }
}
class MockMouseEvent extends MockEvent {
    constructor(type, mouseEventInitDic) {
        super(type);
        this.screenX = 0;
        this.screenY = 0;
        this.clientX = 0;
        this.clientY = 0;
        this.ctrlKey = false;
        this.shiftKey = false;
        this.altKey = false;
        this.metaKey = false;
        this.button = 0;
        this.buttons = 0;
        this.relatedTarget = null;
        if (mouseEventInitDic != null) {
            Object.assign(this, mouseEventInitDic);
        }
    }
}
class MockUIEvent extends MockEvent {
    constructor(type, uiEventInitDic) {
        super(type);
        this.detail = null;
        this.view = null;
        if (uiEventInitDic != null) {
            Object.assign(this, uiEventInitDic);
        }
    }
}
class MockFocusEvent extends MockUIEvent {
    constructor(type, focusEventInitDic) {
        super(type);
        this.relatedTarget = null;
        if (focusEventInitDic != null) {
            Object.assign(this, focusEventInitDic);
        }
    }
}
class MockEventListener {
    constructor(type, handler) {
        this.type = type;
        this.handler = handler;
    }
}
function addEventListener(elm, type, handler) {
    const target = elm;
    if (target.__listeners == null) {
        target.__listeners = [];
    }
    target.__listeners.push(new MockEventListener(type, handler));
}
function removeEventListener(elm, type, handler) {
    const target = elm;
    if (target != null && Array.isArray(target.__listeners) === true) {
        const elmListener = target.__listeners.find((e) => e.type === type && e.handler === handler);
        if (elmListener != null) {
            const index = target.__listeners.indexOf(elmListener);
            target.__listeners.splice(index, 1);
        }
    }
}
function resetEventListeners(target) {
    if (target != null && target.__listeners != null) {
        target.__listeners = null;
    }
}
function triggerEventListener(elm, ev) {
    if (elm == null || ev.cancelBubble === true) {
        return;
    }
    const target = elm;
    ev.currentTarget = elm;
    if (Array.isArray(target.__listeners) === true) {
        const listeners = target.__listeners.filter((e) => e.type === ev.type);
        listeners.forEach((listener) => {
            try {
                listener.handler.call(target, ev);
            }
            catch (err) {
                console.error(err);
            }
        });
    }
    if (ev.bubbles === false) {
        return;
    }
    if (elm.nodeName === "#document" /* NODE_NAMES.DOCUMENT_NODE */) {
        triggerEventListener(elm.defaultView, ev);
    }
    else {
        triggerEventListener(elm.parentElement, ev);
    }
}
function dispatchEvent(currentTarget, ev) {
    ev.target = currentTarget;
    triggerEventListener(currentTarget, ev);
    return true;
}

// Parse5 7.1.2
const e=function(e){const t=new Set([65534,65535,131070,131071,196606,196607,262142,262143,327678,327679,393214,393215,458750,458751,524286,524287,589822,589823,655358,655359,720894,720895,786430,786431,851966,851967,917502,917503,983038,983039,1048574,1048575,1114110,1114111]),s="�";var a;!function(e){e[e.EOF=-1]="EOF",e[e.NULL=0]="NULL",e[e.TABULATION=9]="TABULATION",e[e.CARRIAGE_RETURN=13]="CARRIAGE_RETURN",e[e.LINE_FEED=10]="LINE_FEED",e[e.FORM_FEED=12]="FORM_FEED",e[e.SPACE=32]="SPACE",e[e.EXCLAMATION_MARK=33]="EXCLAMATION_MARK",e[e.QUOTATION_MARK=34]="QUOTATION_MARK",e[e.NUMBER_SIGN=35]="NUMBER_SIGN",e[e.AMPERSAND=38]="AMPERSAND",e[e.APOSTROPHE=39]="APOSTROPHE",e[e.HYPHEN_MINUS=45]="HYPHEN_MINUS",e[e.SOLIDUS=47]="SOLIDUS",e[e.DIGIT_0=48]="DIGIT_0",e[e.DIGIT_9=57]="DIGIT_9",e[e.SEMICOLON=59]="SEMICOLON",e[e.LESS_THAN_SIGN=60]="LESS_THAN_SIGN",e[e.EQUALS_SIGN=61]="EQUALS_SIGN",e[e.GREATER_THAN_SIGN=62]="GREATER_THAN_SIGN",e[e.QUESTION_MARK=63]="QUESTION_MARK",e[e.LATIN_CAPITAL_A=65]="LATIN_CAPITAL_A",e[e.LATIN_CAPITAL_F=70]="LATIN_CAPITAL_F",e[e.LATIN_CAPITAL_X=88]="LATIN_CAPITAL_X",e[e.LATIN_CAPITAL_Z=90]="LATIN_CAPITAL_Z",e[e.RIGHT_SQUARE_BRACKET=93]="RIGHT_SQUARE_BRACKET",e[e.GRAVE_ACCENT=96]="GRAVE_ACCENT",e[e.LATIN_SMALL_A=97]="LATIN_SMALL_A",e[e.LATIN_SMALL_F=102]="LATIN_SMALL_F",e[e.LATIN_SMALL_X=120]="LATIN_SMALL_X",e[e.LATIN_SMALL_Z=122]="LATIN_SMALL_Z",e[e.REPLACEMENT_CHARACTER=65533]="REPLACEMENT_CHARACTER";}(a=a||(a={}));const r="[CDATA[",n="doctype",i="script";function o(e){return e>=55296&&e<=57343}function c(e){return 32!==e&&10!==e&&13!==e&&9!==e&&12!==e&&e>=1&&e<=31||e>=127&&e<=159}function E(e){return e>=64976&&e<=65007||t.has(e)}var T,h;!function(e){e.controlCharacterInInputStream="control-character-in-input-stream",e.noncharacterInInputStream="noncharacter-in-input-stream",e.surrogateInInputStream="surrogate-in-input-stream",e.nonVoidHtmlElementStartTagWithTrailingSolidus="non-void-html-element-start-tag-with-trailing-solidus",e.endTagWithAttributes="end-tag-with-attributes",e.endTagWithTrailingSolidus="end-tag-with-trailing-solidus",e.unexpectedSolidusInTag="unexpected-solidus-in-tag",e.unexpectedNullCharacter="unexpected-null-character",e.unexpectedQuestionMarkInsteadOfTagName="unexpected-question-mark-instead-of-tag-name",e.invalidFirstCharacterOfTagName="invalid-first-character-of-tag-name",e.unexpectedEqualsSignBeforeAttributeName="unexpected-equals-sign-before-attribute-name",e.missingEndTagName="missing-end-tag-name",e.unexpectedCharacterInAttributeName="unexpected-character-in-attribute-name",e.unknownNamedCharacterReference="unknown-named-character-reference",e.missingSemicolonAfterCharacterReference="missing-semicolon-after-character-reference",e.unexpectedCharacterAfterDoctypeSystemIdentifier="unexpected-character-after-doctype-system-identifier",e.unexpectedCharacterInUnquotedAttributeValue="unexpected-character-in-unquoted-attribute-value",e.eofBeforeTagName="eof-before-tag-name",e.eofInTag="eof-in-tag",e.missingAttributeValue="missing-attribute-value",e.missingWhitespaceBetweenAttributes="missing-whitespace-between-attributes",e.missingWhitespaceAfterDoctypePublicKeyword="missing-whitespace-after-doctype-public-keyword",e.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers="missing-whitespace-between-doctype-public-and-system-identifiers",e.missingWhitespaceAfterDoctypeSystemKeyword="missing-whitespace-after-doctype-system-keyword",e.missingQuoteBeforeDoctypePublicIdentifier="missing-quote-before-doctype-public-identifier",e.missingQuoteBeforeDoctypeSystemIdentifier="missing-quote-before-doctype-system-identifier",e.missingDoctypePublicIdentifier="missing-doctype-public-identifier",e.missingDoctypeSystemIdentifier="missing-doctype-system-identifier",e.abruptDoctypePublicIdentifier="abrupt-doctype-public-identifier",e.abruptDoctypeSystemIdentifier="abrupt-doctype-system-identifier",e.cdataInHtmlContent="cdata-in-html-content",e.incorrectlyOpenedComment="incorrectly-opened-comment",e.eofInScriptHtmlCommentLikeText="eof-in-script-html-comment-like-text",e.eofInDoctype="eof-in-doctype",e.nestedComment="nested-comment",e.abruptClosingOfEmptyComment="abrupt-closing-of-empty-comment",e.eofInComment="eof-in-comment",e.incorrectlyClosedComment="incorrectly-closed-comment",e.eofInCdata="eof-in-cdata",e.absenceOfDigitsInNumericCharacterReference="absence-of-digits-in-numeric-character-reference",e.nullCharacterReference="null-character-reference",e.surrogateCharacterReference="surrogate-character-reference",e.characterReferenceOutsideUnicodeRange="character-reference-outside-unicode-range",e.controlCharacterReference="control-character-reference",e.noncharacterCharacterReference="noncharacter-character-reference",e.missingWhitespaceBeforeDoctypeName="missing-whitespace-before-doctype-name",e.missingDoctypeName="missing-doctype-name",e.invalidCharacterSequenceAfterDoctypeName="invalid-character-sequence-after-doctype-name",e.duplicateAttribute="duplicate-attribute",e.nonConformingDoctype="non-conforming-doctype",e.missingDoctype="missing-doctype",e.misplacedDoctype="misplaced-doctype",e.endTagWithoutMatchingOpenElement="end-tag-without-matching-open-element",e.closingOfElementWithOpenChildElements="closing-of-element-with-open-child-elements",e.disallowedContentInNoscriptInHead="disallowed-content-in-noscript-in-head",e.openElementsLeftAfterEof="open-elements-left-after-eof",e.abandonedHeadElementChild="abandoned-head-element-child",e.misplacedStartTagForHeadElement="misplaced-start-tag-for-head-element",e.nestedNoscriptInHead="nested-noscript-in-head",e.eofInElementThatCanContainOnlyText="eof-in-element-that-can-contain-only-text";}(T=T||(T={}));class _{constructor(e){this.handler=e,this.html="",this.pos=-1,this.lastGapPos=-2,this.gapStack=[],this.skipNextNewLine=!1,this.lastChunkWritten=!1,this.endOfChunkHit=!1,this.bufferWaterline=65536,this.isEol=!1,this.lineStartPos=0,this.droppedBufferSize=0,this.line=1,this.lastErrOffset=-1;}get col(){return this.pos-this.lineStartPos+Number(this.lastGapPos!==this.pos)}get offset(){return this.droppedBufferSize+this.pos}getError(e){const{line:t,col:s,offset:a}=this;return {code:e,startLine:t,endLine:t,startCol:s,endCol:s,startOffset:a,endOffset:a}}_err(e){this.handler.onParseError&&this.lastErrOffset!==this.offset&&(this.lastErrOffset=this.offset,this.handler.onParseError(this.getError(e)));}_addGap(){this.gapStack.push(this.lastGapPos),this.lastGapPos=this.pos;}_processSurrogate(e){if(this.pos!==this.html.length-1){const t=this.html.charCodeAt(this.pos+1);if(function(e){return e>=56320&&e<=57343}(t))return this.pos++,this._addGap(),1024*(e-55296)+9216+t}else if(!this.lastChunkWritten)return this.endOfChunkHit=!0,a.EOF;return this._err(T.surrogateInInputStream),e}willDropParsedChunk(){return this.pos>this.bufferWaterline}dropParsedChunk(){this.willDropParsedChunk()&&(this.html=this.html.substring(this.pos),this.lineStartPos-=this.pos,this.droppedBufferSize+=this.pos,this.pos=0,this.lastGapPos=-2,this.gapStack.length=0);}write(e,t){this.html.length>0?this.html+=e:this.html=e,this.endOfChunkHit=!1,this.lastChunkWritten=t;}insertHtmlAtCurrentPos(e){this.html=this.html.substring(0,this.pos+1)+e+this.html.substring(this.pos+1),this.endOfChunkHit=!1;}startsWith(e,t){if(this.pos+e.length>this.html.length)return this.endOfChunkHit=!this.lastChunkWritten,!1;if(t)return this.html.startsWith(e,this.pos);for(let t=0;t<e.length;t++)if((32|this.html.charCodeAt(this.pos+t))!==e.charCodeAt(t))return !1;return !0}peek(e){const t=this.pos+e;if(t>=this.html.length)return this.endOfChunkHit=!this.lastChunkWritten,a.EOF;const s=this.html.charCodeAt(t);return s===a.CARRIAGE_RETURN?a.LINE_FEED:s}advance(){if(this.pos++,this.isEol&&(this.isEol=!1,this.line++,this.lineStartPos=this.pos),this.pos>=this.html.length)return this.endOfChunkHit=!this.lastChunkWritten,a.EOF;let e=this.html.charCodeAt(this.pos);return e===a.CARRIAGE_RETURN?(this.isEol=!0,this.skipNextNewLine=!0,a.LINE_FEED):e===a.LINE_FEED&&(this.isEol=!0,this.skipNextNewLine)?(this.line--,this.skipNextNewLine=!1,this._addGap(),this.advance()):(this.skipNextNewLine=!1,o(e)&&(e=this._processSurrogate(e)),null===this.handler.onParseError||e>31&&e<127||e===a.LINE_FEED||e===a.CARRIAGE_RETURN||e>159&&e<64976||this._checkForProblematicCharacters(e),e)}_checkForProblematicCharacters(e){c(e)?this._err(T.controlCharacterInInputStream):E(e)&&this._err(T.noncharacterInInputStream);}retreat(e){for(this.pos-=e;this.pos<this.lastGapPos;)this.lastGapPos=this.gapStack.pop(),this.pos--;this.isEol=!1;}}function A(e,t){for(let s=e.attrs.length-1;s>=0;s--)if(e.attrs[s].name===t)return e.attrs[s].value;return null}!function(e){e[e.CHARACTER=0]="CHARACTER",e[e.NULL_CHARACTER=1]="NULL_CHARACTER",e[e.WHITESPACE_CHARACTER=2]="WHITESPACE_CHARACTER",e[e.START_TAG=3]="START_TAG",e[e.END_TAG=4]="END_TAG",e[e.COMMENT=5]="COMMENT",e[e.DOCTYPE=6]="DOCTYPE",e[e.EOF=7]="EOF",e[e.HIBERNATION=8]="HIBERNATION";}(h=h||(h={}));var l="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},m={},d={};Object.defineProperty(d,"__esModule",{value:!0}),d.default=new Uint16Array('ᵁ<Õıʊҝջאٵ۞ޢߖࠏ੊ઑඡ๭༉༦჊ረዡᐕᒝᓃᓟᔥ\0\0\0\0\0\0ᕫᛍᦍᰒᷝ὾⁠↰⊍⏀⏻⑂⠤⤒ⴈ⹈⿎〖㊺㘹㞬㣾㨨㩱㫠㬮ࠀEMabcfglmnoprstu\\bfms¦³¹ÈÏlig耻Æ䃆P耻&䀦cute耻Á䃁reve;䄂Āiyx}rc耻Â䃂;䐐r;쀀𝔄rave耻À䃀pha;䎑acr;䄀d;橓Āgp¡on;䄄f;쀀𝔸plyFunction;恡ing耻Å䃅Ācs¾Ãr;쀀𝒜ign;扔ilde耻Ã䃃ml耻Ä䃄ЀaceforsuåûþėĜĢħĪĀcrêòkslash;或Ŷöø;櫧ed;挆y;䐑ƀcrtąċĔause;戵noullis;愬a;䎒r;쀀𝔅pf;쀀𝔹eve;䋘còēmpeq;扎܀HOacdefhilorsuōőŖƀƞƢƵƷƺǜȕɳɸɾcy;䐧PY耻©䂩ƀcpyŝŢźute;䄆Ā;iŧŨ拒talDifferentialD;慅leys;愭ȀaeioƉƎƔƘron;䄌dil耻Ç䃇rc;䄈nint;戰ot;䄊ĀdnƧƭilla;䂸terDot;䂷òſi;䎧rcleȀDMPTǇǋǑǖot;抙inus;抖lus;投imes;抗oĀcsǢǸkwiseContourIntegral;戲eCurlyĀDQȃȏoubleQuote;思uote;怙ȀlnpuȞȨɇɕonĀ;eȥȦ户;橴ƀgitȯȶȺruent;扡nt;戯ourIntegral;戮ĀfrɌɎ;愂oduct;成nterClockwiseContourIntegral;戳oss;樯cr;쀀𝒞pĀ;Cʄʅ拓ap;才րDJSZacefiosʠʬʰʴʸˋ˗ˡ˦̳ҍĀ;oŹʥtrahd;椑cy;䐂cy;䐅cy;䐏ƀgrsʿ˄ˇger;怡r;憡hv;櫤Āayː˕ron;䄎;䐔lĀ;t˝˞戇a;䎔r;쀀𝔇Āaf˫̧Ācm˰̢riticalȀADGT̖̜̀̆cute;䂴oŴ̋̍;䋙bleAcute;䋝rave;䁠ilde;䋜ond;拄ferentialD;慆Ѱ̽\0\0\0͔͂\0Ѕf;쀀𝔻ƀ;DE͈͉͍䂨ot;惜qual;扐blèCDLRUVͣͲ΂ϏϢϸontourIntegraìȹoɴ͹\0\0ͻ»͉nArrow;懓Āeo·ΤftƀARTΐΖΡrrow;懐ightArrow;懔eåˊngĀLRΫτeftĀARγιrrow;柸ightArrow;柺ightArrow;柹ightĀATϘϞrrow;懒ee;抨pɁϩ\0\0ϯrrow;懑ownArrow;懕erticalBar;戥ǹABLRTaВЪаўѿͼrrowƀ;BUНОТ憓ar;椓pArrow;懵reve;䌑eft˒к\0ц\0ѐightVector;楐eeVector;楞ectorĀ;Bљњ憽ar;楖ightǔѧ\0ѱeeVector;楟ectorĀ;BѺѻ懁ar;楗eeĀ;A҆҇护rrow;憧ĀctҒҗr;쀀𝒟rok;䄐ࠀNTacdfglmopqstuxҽӀӄӋӞӢӧӮӵԡԯԶՒ՝ՠեG;䅊H耻Ð䃐cute耻É䃉ƀaiyӒӗӜron;䄚rc耻Ê䃊;䐭ot;䄖r;쀀𝔈rave耻È䃈ement;戈ĀapӺӾcr;䄒tyɓԆ\0\0ԒmallSquare;旻erySmallSquare;斫ĀgpԦԪon;䄘f;쀀𝔼silon;䎕uĀaiԼՉlĀ;TՂՃ橵ilde;扂librium;懌Āci՗՚r;愰m;橳a;䎗ml耻Ë䃋Āipժկsts;戃onentialE;慇ʀcfiosօֈ֍ֲ׌y;䐤r;쀀𝔉lledɓ֗\0\0֣mallSquare;旼erySmallSquare;斪Ͱֺ\0ֿ\0\0ׄf;쀀𝔽All;戀riertrf;愱cò׋؀JTabcdfgorstר׬ׯ׺؀ؒؖ؛؝أ٬ٲcy;䐃耻>䀾mmaĀ;d׷׸䎓;䏜reve;䄞ƀeiy؇،ؐdil;䄢rc;䄜;䐓ot;䄠r;쀀𝔊;拙pf;쀀𝔾eater̀EFGLSTصلَٖٛ٦qualĀ;Lؾؿ扥ess;招ullEqual;执reater;檢ess;扷lantEqual;橾ilde;扳cr;쀀𝒢;扫ЀAacfiosuڅڋږڛڞڪھۊRDcy;䐪Āctڐڔek;䋇;䁞irc;䄤r;愌lbertSpace;愋ǰگ\0ڲf;愍izontalLine;攀Āctۃۅòکrok;䄦mpńېۘownHumðįqual;扏܀EJOacdfgmnostuۺ۾܃܇܎ܚܞܡܨ݄ݸދޏޕcy;䐕lig;䄲cy;䐁cute耻Í䃍Āiyܓܘrc耻Î䃎;䐘ot;䄰r;愑rave耻Ì䃌ƀ;apܠܯܿĀcgܴܷr;䄪inaryI;慈lieóϝǴ݉\0ݢĀ;eݍݎ戬Āgrݓݘral;戫section;拂isibleĀCTݬݲomma;恣imes;恢ƀgptݿރވon;䄮f;쀀𝕀a;䎙cr;愐ilde;䄨ǫޚ\0ޞcy;䐆l耻Ï䃏ʀcfosuެ޷޼߂ߐĀiyޱ޵rc;䄴;䐙r;쀀𝔍pf;쀀𝕁ǣ߇\0ߌr;쀀𝒥rcy;䐈kcy;䐄΀HJacfosߤߨ߽߬߱ࠂࠈcy;䐥cy;䐌ppa;䎚Āey߶߻dil;䄶;䐚r;쀀𝔎pf;쀀𝕂cr;쀀𝒦րJTaceflmostࠥࠩࠬࡐࡣ঳সে্਷ੇcy;䐉耻<䀼ʀcmnpr࠷࠼ࡁࡄࡍute;䄹bda;䎛g;柪lacetrf;愒r;憞ƀaeyࡗ࡜ࡡron;䄽dil;䄻;䐛Āfsࡨ॰tԀACDFRTUVarࡾࢩࢱࣦ࣠ࣼयज़ΐ४Ānrࢃ࢏gleBracket;柨rowƀ;BR࢙࢚࢞憐ar;懤ightArrow;懆eiling;挈oǵࢷ\0ࣃbleBracket;柦nǔࣈ\0࣒eeVector;楡ectorĀ;Bࣛࣜ懃ar;楙loor;挊ightĀAV࣯ࣵrrow;憔ector;楎Āerँगeƀ;AVउऊऐ抣rrow;憤ector;楚iangleƀ;BEतथऩ抲ar;槏qual;抴pƀDTVषूौownVector;楑eeVector;楠ectorĀ;Bॖॗ憿ar;楘ectorĀ;B॥०憼ar;楒ightáΜs̀EFGLSTॾঋকঝঢভqualGreater;拚ullEqual;扦reater;扶ess;檡lantEqual;橽ilde;扲r;쀀𝔏Ā;eঽা拘ftarrow;懚idot;䄿ƀnpw৔ਖਛgȀLRlr৞৷ਂਐeftĀAR০৬rrow;柵ightArrow;柷ightArrow;柶eftĀarγਊightáοightáϊf;쀀𝕃erĀLRਢਬeftArrow;憙ightArrow;憘ƀchtਾੀੂòࡌ;憰rok;䅁;扪Ѐacefiosuਗ਼੝੠੷੼અઋ઎p;椅y;䐜Ādl੥੯iumSpace;恟lintrf;愳r;쀀𝔐nusPlus;戓pf;쀀𝕄cò੶;䎜ҀJacefostuણધભીଔଙඑ඗ඞcy;䐊cute;䅃ƀaey઴હાron;䅇dil;䅅;䐝ƀgswે૰଎ativeƀMTV૓૟૨ediumSpace;怋hiĀcn૦૘ë૙eryThiî૙tedĀGL૸ଆreaterGreateòٳessLesóੈLine;䀊r;쀀𝔑ȀBnptଢନଷ଺reak;恠BreakingSpace;䂠f;愕ڀ;CDEGHLNPRSTV୕ୖ୪୼஡௫ఄ౞಄ದ೘ൡඅ櫬Āou୛୤ngruent;扢pCap;扭oubleVerticalBar;戦ƀlqxஃஊ஛ement;戉ualĀ;Tஒஓ扠ilde;쀀≂̸ists;戄reater΀;EFGLSTஶஷ஽௉௓௘௥扯qual;扱ullEqual;쀀≧̸reater;쀀≫̸ess;批lantEqual;쀀⩾̸ilde;扵umpń௲௽ownHump;쀀≎̸qual;쀀≏̸eĀfsఊధtTriangleƀ;BEచఛడ拪ar;쀀⧏̸qual;括s̀;EGLSTవశ఼ౄోౘ扮qual;扰reater;扸ess;쀀≪̸lantEqual;쀀⩽̸ilde;扴estedĀGL౨౹reaterGreater;쀀⪢̸essLess;쀀⪡̸recedesƀ;ESಒಓಛ技qual;쀀⪯̸lantEqual;拠ĀeiಫಹverseElement;戌ghtTriangleƀ;BEೋೌ೒拫ar;쀀⧐̸qual;拭ĀquೝഌuareSuĀbp೨೹setĀ;E೰ೳ쀀⊏̸qual;拢ersetĀ;Eഃആ쀀⊐̸qual;拣ƀbcpഓതൎsetĀ;Eഛഞ쀀⊂⃒qual;抈ceedsȀ;ESTലള഻െ抁qual;쀀⪰̸lantEqual;拡ilde;쀀≿̸ersetĀ;E൘൛쀀⊃⃒qual;抉ildeȀ;EFT൮൯൵ൿ扁qual;扄ullEqual;扇ilde;扉erticalBar;戤cr;쀀𝒩ilde耻Ñ䃑;䎝܀Eacdfgmoprstuvලෂ෉෕ෛ෠෧෼ขภยา฿ไlig;䅒cute耻Ó䃓Āiy෎ීrc耻Ô䃔;䐞blac;䅐r;쀀𝔒rave耻Ò䃒ƀaei෮ෲ෶cr;䅌ga;䎩cron;䎟pf;쀀𝕆enCurlyĀDQฎบoubleQuote;怜uote;怘;橔Āclวฬr;쀀𝒪ash耻Ø䃘iŬื฼de耻Õ䃕es;樷ml耻Ö䃖erĀBP๋๠Āar๐๓r;怾acĀek๚๜;揞et;掴arenthesis;揜Ҁacfhilors๿ງຊຏຒດຝະ໼rtialD;戂y;䐟r;쀀𝔓i;䎦;䎠usMinus;䂱Āipຢອncareplanåڝf;愙Ȁ;eio຺ູ໠໤檻cedesȀ;EST່້໏໚扺qual;檯lantEqual;扼ilde;找me;怳Ādp໩໮uct;戏ortionĀ;aȥ໹l;戝Āci༁༆r;쀀𝒫;䎨ȀUfos༑༖༛༟OT耻"䀢r;쀀𝔔pf;愚cr;쀀𝒬؀BEacefhiorsu༾གྷཇའཱིྦྷྪྭ႖ႩႴႾarr;椐G耻®䂮ƀcnrཎནབute;䅔g;柫rĀ;tཛྷཝ憠l;椖ƀaeyཧཬཱron;䅘dil;䅖;䐠Ā;vླྀཹ愜erseĀEUྂྙĀlq྇ྎement;戋uilibrium;懋pEquilibrium;楯r»ཹo;䎡ghtЀACDFTUVa࿁࿫࿳ဢဨၛႇϘĀnr࿆࿒gleBracket;柩rowƀ;BL࿜࿝࿡憒ar;懥eftArrow;懄eiling;按oǵ࿹\0စbleBracket;柧nǔည\0နeeVector;楝ectorĀ;Bဝသ懂ar;楕loor;挋Āerိ၃eƀ;AVဵံြ抢rrow;憦ector;楛iangleƀ;BEၐၑၕ抳ar;槐qual;抵pƀDTVၣၮၸownVector;楏eeVector;楜ectorĀ;Bႂႃ憾ar;楔ectorĀ;B႑႒懀ar;楓Āpuႛ႞f;愝ndImplies;楰ightarrow;懛ĀchႹႼr;愛;憱leDelayed;槴ڀHOacfhimoqstuფჱჷჽᄙᄞᅑᅖᅡᅧᆵᆻᆿĀCcჩხHcy;䐩y;䐨FTcy;䐬cute;䅚ʀ;aeiyᄈᄉᄎᄓᄗ檼ron;䅠dil;䅞rc;䅜;䐡r;쀀𝔖ortȀDLRUᄪᄴᄾᅉownArrow»ОeftArrow»࢚ightArrow»࿝pArrow;憑gma;䎣allCircle;战pf;쀀𝕊ɲᅭ\0\0ᅰt;戚areȀ;ISUᅻᅼᆉᆯ斡ntersection;抓uĀbpᆏᆞsetĀ;Eᆗᆘ抏qual;抑ersetĀ;Eᆨᆩ抐qual;抒nion;抔cr;쀀𝒮ar;拆ȀbcmpᇈᇛሉላĀ;sᇍᇎ拐etĀ;Eᇍᇕqual;抆ĀchᇠህeedsȀ;ESTᇭᇮᇴᇿ扻qual;檰lantEqual;扽ilde;承Tháྌ;我ƀ;esሒሓሣ拑rsetĀ;Eሜም抃qual;抇et»ሓրHRSacfhiorsሾቄ቉ቕ቞ቱቶኟዂወዑORN耻Þ䃞ADE;愢ĀHc቎ቒcy;䐋y;䐦Ābuቚቜ;䀉;䎤ƀaeyብቪቯron;䅤dil;䅢;䐢r;쀀𝔗Āeiቻ኉ǲኀ\0ኇefore;戴a;䎘Ācn኎ኘkSpace;쀀  Space;怉ldeȀ;EFTካኬኲኼ戼qual;扃ullEqual;扅ilde;扈pf;쀀𝕋ipleDot;惛Āctዖዛr;쀀𝒯rok;䅦ૡዷጎጚጦ\0ጬጱ\0\0\0\0\0ጸጽ፷ᎅ\0᏿ᐄᐊᐐĀcrዻጁute耻Ú䃚rĀ;oጇገ憟cir;楉rǣጓ\0጖y;䐎ve;䅬Āiyጞጣrc耻Û䃛;䐣blac;䅰r;쀀𝔘rave耻Ù䃙acr;䅪Ādiፁ፩erĀBPፈ፝Āarፍፐr;䁟acĀekፗፙ;揟et;掵arenthesis;揝onĀ;P፰፱拃lus;抎Āgp፻፿on;䅲f;쀀𝕌ЀADETadps᎕ᎮᎸᏄϨᏒᏗᏳrrowƀ;BDᅐᎠᎤar;椒ownArrow;懅ownArrow;憕quilibrium;楮eeĀ;AᏋᏌ报rrow;憥ownáϳerĀLRᏞᏨeftArrow;憖ightArrow;憗iĀ;lᏹᏺ䏒on;䎥ing;䅮cr;쀀𝒰ilde;䅨ml耻Ü䃜ҀDbcdefosvᐧᐬᐰᐳᐾᒅᒊᒐᒖash;披ar;櫫y;䐒ashĀ;lᐻᐼ抩;櫦Āerᑃᑅ;拁ƀbtyᑌᑐᑺar;怖Ā;iᑏᑕcalȀBLSTᑡᑥᑪᑴar;戣ine;䁼eparator;杘ilde;所ThinSpace;怊r;쀀𝔙pf;쀀𝕍cr;쀀𝒱dash;抪ʀcefosᒧᒬᒱᒶᒼirc;䅴dge;拀r;쀀𝔚pf;쀀𝕎cr;쀀𝒲Ȁfiosᓋᓐᓒᓘr;쀀𝔛;䎞pf;쀀𝕏cr;쀀𝒳ҀAIUacfosuᓱᓵᓹᓽᔄᔏᔔᔚᔠcy;䐯cy;䐇cy;䐮cute耻Ý䃝Āiyᔉᔍrc;䅶;䐫r;쀀𝔜pf;쀀𝕐cr;쀀𝒴ml;䅸ЀHacdefosᔵᔹᔿᕋᕏᕝᕠᕤcy;䐖cute;䅹Āayᕄᕉron;䅽;䐗ot;䅻ǲᕔ\0ᕛoWidtè૙a;䎖r;愨pf;愤cr;쀀𝒵௡ᖃᖊᖐ\0ᖰᖶᖿ\0\0\0\0ᗆᗛᗫᙟ᙭\0ᚕ᚛ᚲᚹ\0ᚾcute耻á䃡reve;䄃̀;Ediuyᖜᖝᖡᖣᖨᖭ戾;쀀∾̳;房rc耻â䃢te肻´̆;䐰lig耻æ䃦Ā;r²ᖺ;쀀𝔞rave耻à䃠ĀepᗊᗖĀfpᗏᗔsym;愵èᗓha;䎱ĀapᗟcĀclᗤᗧr;䄁g;樿ɤᗰ\0\0ᘊʀ;adsvᗺᗻᗿᘁᘇ戧nd;橕;橜lope;橘;橚΀;elmrszᘘᘙᘛᘞᘿᙏᙙ戠;榤e»ᘙsdĀ;aᘥᘦ戡ѡᘰᘲᘴᘶᘸᘺᘼᘾ;榨;榩;榪;榫;榬;榭;榮;榯tĀ;vᙅᙆ戟bĀ;dᙌᙍ抾;榝Āptᙔᙗh;戢»¹arr;捼Āgpᙣᙧon;䄅f;쀀𝕒΀;Eaeiop዁ᙻᙽᚂᚄᚇᚊ;橰cir;橯;扊d;手s;䀧roxĀ;e዁ᚒñᚃing耻å䃥ƀctyᚡᚦᚨr;쀀𝒶;䀪mpĀ;e዁ᚯñʈilde耻ã䃣ml耻ä䃤Āciᛂᛈoninôɲnt;樑ࠀNabcdefiklnoprsu᛭ᛱᜰ᜼ᝃᝈ᝸᝽០៦ᠹᡐᜍ᤽᥈ᥰot;櫭Ācrᛶ᜞kȀcepsᜀᜅᜍᜓong;扌psilon;䏶rime;怵imĀ;e᜚᜛戽q;拍Ŷᜢᜦee;抽edĀ;gᜬᜭ挅e»ᜭrkĀ;t፜᜷brk;掶Āoyᜁᝁ;䐱quo;怞ʀcmprtᝓ᝛ᝡᝤᝨausĀ;eĊĉptyv;榰séᜌnoõēƀahwᝯ᝱ᝳ;䎲;愶een;扬r;쀀𝔟g΀costuvwឍឝឳេ៕៛៞ƀaiuបពរðݠrc;旯p»፱ƀdptឤឨឭot;樀lus;樁imes;樂ɱឹ\0\0ើcup;樆ar;昅riangleĀdu៍្own;施p;斳plus;樄eåᑄåᒭarow;植ƀako៭ᠦᠵĀcn៲ᠣkƀlst៺֫᠂ozenge;槫riangleȀ;dlr᠒᠓᠘᠝斴own;斾eft;旂ight;斸k;搣Ʊᠫ\0ᠳƲᠯ\0ᠱ;斒;斑4;斓ck;斈ĀeoᠾᡍĀ;qᡃᡆ쀀=⃥uiv;쀀≡⃥t;挐Ȁptwxᡙᡞᡧᡬf;쀀𝕓Ā;tᏋᡣom»Ꮜtie;拈؀DHUVbdhmptuvᢅᢖᢪᢻᣗᣛᣬ᣿ᤅᤊᤐᤡȀLRlrᢎᢐᢒᢔ;敗;敔;敖;敓ʀ;DUduᢡᢢᢤᢦᢨ敐;敦;敩;敤;敧ȀLRlrᢳᢵᢷᢹ;敝;敚;敜;教΀;HLRhlrᣊᣋᣍᣏᣑᣓᣕ救;敬;散;敠;敫;敢;敟ox;槉ȀLRlrᣤᣦᣨᣪ;敕;敒;攐;攌ʀ;DUduڽ᣷᣹᣻᣽;敥;敨;攬;攴inus;抟lus;択imes;抠ȀLRlrᤙᤛᤝ᤟;敛;敘;攘;攔΀;HLRhlrᤰᤱᤳᤵᤷ᤻᤹攂;敪;敡;敞;攼;攤;攜Āevģ᥂bar耻¦䂦Ȁceioᥑᥖᥚᥠr;쀀𝒷mi;恏mĀ;e᜚᜜lƀ;bhᥨᥩᥫ䁜;槅sub;柈Ŭᥴ᥾lĀ;e᥹᥺怢t»᥺pƀ;Eeįᦅᦇ;檮Ā;qۜۛೡᦧ\0᧨ᨑᨕᨲ\0ᨷᩐ\0\0᪴\0\0᫁\0\0ᬡᬮ᭍᭒\0᯽\0ᰌƀcpr᦭ᦲ᧝ute;䄇̀;abcdsᦿᧀᧄ᧊᧕᧙戩nd;橄rcup;橉Āau᧏᧒p;橋p;橇ot;橀;쀀∩︀Āeo᧢᧥t;恁îړȀaeiu᧰᧻ᨁᨅǰ᧵\0᧸s;橍on;䄍dil耻ç䃧rc;䄉psĀ;sᨌᨍ橌m;橐ot;䄋ƀdmnᨛᨠᨦil肻¸ƭptyv;榲t脀¢;eᨭᨮ䂢räƲr;쀀𝔠ƀceiᨽᩀᩍy;䑇ckĀ;mᩇᩈ朓ark»ᩈ;䏇r΀;Ecefms᩟᩠ᩢᩫ᪤᪪᪮旋;槃ƀ;elᩩᩪᩭ䋆q;扗eɡᩴ\0\0᪈rrowĀlr᩼᪁eft;憺ight;憻ʀRSacd᪒᪔᪖᪚᪟»ཇ;擈st;抛irc;抚ash;抝nint;樐id;櫯cir;槂ubsĀ;u᪻᪼晣it»᪼ˬ᫇᫔᫺\0ᬊonĀ;eᫍᫎ䀺Ā;qÇÆɭ᫙\0\0᫢aĀ;t᫞᫟䀬;䁀ƀ;fl᫨᫩᫫戁îᅠeĀmx᫱᫶ent»᫩eóɍǧ᫾\0ᬇĀ;dኻᬂot;橭nôɆƀfryᬐᬔᬗ;쀀𝕔oäɔ脀©;sŕᬝr;愗Āaoᬥᬩrr;憵ss;朗Ācuᬲᬷr;쀀𝒸Ābpᬼ᭄Ā;eᭁᭂ櫏;櫑Ā;eᭉᭊ櫐;櫒dot;拯΀delprvw᭠᭬᭷ᮂᮬᯔ᯹arrĀlr᭨᭪;椸;椵ɰ᭲\0\0᭵r;拞c;拟arrĀ;p᭿ᮀ憶;椽̀;bcdosᮏᮐᮖᮡᮥᮨ截rcap;橈Āauᮛᮞp;橆p;橊ot;抍r;橅;쀀∪︀Ȁalrv᮵ᮿᯞᯣrrĀ;mᮼᮽ憷;椼yƀevwᯇᯔᯘqɰᯎ\0\0ᯒreã᭳uã᭵ee;拎edge;拏en耻¤䂤earrowĀlrᯮ᯳eft»ᮀight»ᮽeäᯝĀciᰁᰇoninôǷnt;戱lcty;挭ঀAHabcdefhijlorstuwz᰸᰻᰿ᱝᱩᱵᲊᲞᲬᲷ᳻᳿ᴍᵻᶑᶫᶻ᷆᷍rò΁ar;楥Ȁglrs᱈ᱍ᱒᱔ger;怠eth;愸òᄳhĀ;vᱚᱛ怐»ऊūᱡᱧarow;椏aã̕Āayᱮᱳron;䄏;䐴ƀ;ao̲ᱼᲄĀgrʿᲁr;懊tseq;橷ƀglmᲑᲔᲘ耻°䂰ta;䎴ptyv;榱ĀirᲣᲨsht;楿;쀀𝔡arĀlrᲳᲵ»ࣜ»သʀaegsv᳂͸᳖᳜᳠mƀ;oș᳊᳔ndĀ;ș᳑uit;晦amma;䏝in;拲ƀ;io᳧᳨᳸䃷de脀÷;o᳧ᳰntimes;拇nø᳷cy;䑒cɯᴆ\0\0ᴊrn;挞op;挍ʀlptuwᴘᴝᴢᵉᵕlar;䀤f;쀀𝕕ʀ;emps̋ᴭᴷᴽᵂqĀ;d͒ᴳot;扑inus;戸lus;戔quare;抡blebarwedgåúnƀadhᄮᵝᵧownarrowóᲃarpoonĀlrᵲᵶefôᲴighôᲶŢᵿᶅkaro÷གɯᶊ\0\0ᶎrn;挟op;挌ƀcotᶘᶣᶦĀryᶝᶡ;쀀𝒹;䑕l;槶rok;䄑Ādrᶰᶴot;拱iĀ;fᶺ᠖斿Āah᷀᷃ròЩaòྦangle;榦Āci᷒ᷕy;䑟grarr;柿ऀDacdefglmnopqrstuxḁḉḙḸոḼṉṡṾấắẽỡἪἷὄ὎὚ĀDoḆᴴoôᲉĀcsḎḔute耻é䃩ter;橮ȀaioyḢḧḱḶron;䄛rĀ;cḭḮ扖耻ê䃪lon;払;䑍ot;䄗ĀDrṁṅot;扒;쀀𝔢ƀ;rsṐṑṗ檚ave耻è䃨Ā;dṜṝ檖ot;檘Ȁ;ilsṪṫṲṴ檙nters;揧;愓Ā;dṹṺ檕ot;檗ƀapsẅẉẗcr;䄓tyƀ;svẒẓẕ戅et»ẓpĀ1;ẝẤĳạả;怄;怅怃ĀgsẪẬ;䅋p;怂ĀgpẴẸon;䄙f;쀀𝕖ƀalsỄỎỒrĀ;sỊị拕l;槣us;橱iƀ;lvỚớở䎵on»ớ;䏵ȀcsuvỪỳἋἣĀioữḱrc»Ḯɩỹ\0\0ỻíՈantĀglἂἆtr»ṝess»Ṻƀaeiἒ἖Ἒls;䀽st;扟vĀ;DȵἠD;橸parsl;槥ĀDaἯἳot;打rr;楱ƀcdiἾὁỸr;愯oô͒ĀahὉὋ;䎷耻ð䃰Āmrὓὗl耻ë䃫o;悬ƀcipὡὤὧl;䀡sôծĀeoὬὴctatioîՙnentialåչৡᾒ\0ᾞ\0ᾡᾧ\0\0ῆῌ\0ΐ\0ῦῪ \0 ⁚llingdotseñṄy;䑄male;晀ƀilrᾭᾳ῁lig;耀ﬃɩᾹ\0\0᾽g;耀ﬀig;耀ﬄ;쀀𝔣lig;耀ﬁlig;쀀fjƀaltῙ῜ῡt;晭ig;耀ﬂns;斱of;䆒ǰ΅\0ῳf;쀀𝕗ĀakֿῷĀ;vῼ´拔;櫙artint;樍Āao‌⁕Ācs‑⁒α‚‰‸⁅⁈\0⁐β•‥‧‪‬\0‮耻½䂽;慓耻¼䂼;慕;慙;慛Ƴ‴\0‶;慔;慖ʴ‾⁁\0\0⁃耻¾䂾;慗;慜5;慘ƶ⁌\0⁎;慚;慝8;慞l;恄wn;挢cr;쀀𝒻ࢀEabcdefgijlnorstv₂₉₟₥₰₴⃰⃵⃺⃿℃ℒℸ̗ℾ⅒↞Ā;lٍ₇;檌ƀcmpₐₕ₝ute;䇵maĀ;dₜ᳚䎳;檆reve;䄟Āiy₪₮rc;䄝;䐳ot;䄡Ȁ;lqsؾق₽⃉ƀ;qsؾٌ⃄lanô٥Ȁ;cdl٥⃒⃥⃕c;檩otĀ;o⃜⃝檀Ā;l⃢⃣檂;檄Ā;e⃪⃭쀀⋛︀s;檔r;쀀𝔤Ā;gٳ؛mel;愷cy;䑓Ȁ;Eajٚℌℎℐ;檒;檥;檤ȀEaesℛℝ℩ℴ;扩pĀ;p℣ℤ檊rox»ℤĀ;q℮ℯ檈Ā;q℮ℛim;拧pf;쀀𝕘Āci⅃ⅆr;愊mƀ;el٫ⅎ⅐;檎;檐茀>;cdlqr׮ⅠⅪⅮⅳⅹĀciⅥⅧ;檧r;橺ot;拗Par;榕uest;橼ʀadelsↄⅪ←ٖ↛ǰ↉\0↎proø₞r;楸qĀlqؿ↖lesó₈ií٫Āen↣↭rtneqq;쀀≩︀Å↪ԀAabcefkosy⇄⇇⇱⇵⇺∘∝∯≨≽ròΠȀilmr⇐⇔⇗⇛rsðᒄf»․ilôکĀdr⇠⇤cy;䑊ƀ;cwࣴ⇫⇯ir;楈;憭ar;意irc;䄥ƀalr∁∎∓rtsĀ;u∉∊晥it»∊lip;怦con;抹r;쀀𝔥sĀew∣∩arow;椥arow;椦ʀamopr∺∾≃≞≣rr;懿tht;戻kĀlr≉≓eftarrow;憩ightarrow;憪f;쀀𝕙bar;怕ƀclt≯≴≸r;쀀𝒽asè⇴rok;䄧Ābp⊂⊇ull;恃hen»ᱛૡ⊣\0⊪\0⊸⋅⋎\0⋕⋳\0\0⋸⌢⍧⍢⍿\0⎆⎪⎴cute耻í䃭ƀ;iyݱ⊰⊵rc耻î䃮;䐸Ācx⊼⊿y;䐵cl耻¡䂡ĀfrΟ⋉;쀀𝔦rave耻ì䃬Ȁ;inoܾ⋝⋩⋮Āin⋢⋦nt;樌t;戭fin;槜ta;愩lig;䄳ƀaop⋾⌚⌝ƀcgt⌅⌈⌗r;䄫ƀelpܟ⌏⌓inåގarôܠh;䄱f;抷ed;䆵ʀ;cfotӴ⌬⌱⌽⍁are;愅inĀ;t⌸⌹戞ie;槝doô⌙ʀ;celpݗ⍌⍐⍛⍡al;抺Āgr⍕⍙eróᕣã⍍arhk;樗rod;樼Ȁcgpt⍯⍲⍶⍻y;䑑on;䄯f;쀀𝕚a;䎹uest耻¿䂿Āci⎊⎏r;쀀𝒾nʀ;EdsvӴ⎛⎝⎡ӳ;拹ot;拵Ā;v⎦⎧拴;拳Ā;iݷ⎮lde;䄩ǫ⎸\0⎼cy;䑖l耻ï䃯̀cfmosu⏌⏗⏜⏡⏧⏵Āiy⏑⏕rc;䄵;䐹r;쀀𝔧ath;䈷pf;쀀𝕛ǣ⏬\0⏱r;쀀𝒿rcy;䑘kcy;䑔Ѐacfghjos␋␖␢␧␭␱␵␻ppaĀ;v␓␔䎺;䏰Āey␛␠dil;䄷;䐺r;쀀𝔨reen;䄸cy;䑅cy;䑜pf;쀀𝕜cr;쀀𝓀஀ABEHabcdefghjlmnoprstuv⑰⒁⒆⒍⒑┎┽╚▀♎♞♥♹♽⚚⚲⛘❝❨➋⟀⠁⠒ƀart⑷⑺⑼rò৆òΕail;椛arr;椎Ā;gঔ⒋;檋ar;楢ॣ⒥\0⒪\0⒱\0\0\0\0\0⒵Ⓔ\0ⓆⓈⓍ\0⓹ute;䄺mptyv;榴raîࡌbda;䎻gƀ;dlࢎⓁⓃ;榑åࢎ;檅uo耻«䂫rЀ;bfhlpst࢙ⓞⓦⓩ⓫⓮⓱⓵Ā;f࢝ⓣs;椟s;椝ë≒p;憫l;椹im;楳l;憢ƀ;ae⓿─┄檫il;椙Ā;s┉┊檭;쀀⪭︀ƀabr┕┙┝rr;椌rk;杲Āak┢┬cĀek┨┪;䁻;䁛Āes┱┳;榋lĀdu┹┻;榏;榍Ȁaeuy╆╋╖╘ron;䄾Ādi═╔il;䄼ìࢰâ┩;䐻Ȁcqrs╣╦╭╽a;椶uoĀ;rนᝆĀdu╲╷har;楧shar;楋h;憲ʀ;fgqs▋▌উ◳◿扤tʀahlrt▘▤▷◂◨rrowĀ;t࢙□aé⓶arpoonĀdu▯▴own»њp»०eftarrows;懇ightƀahs◍◖◞rrowĀ;sࣴࢧarpoonó྘quigarro÷⇰hreetimes;拋ƀ;qs▋ও◺lanôবʀ;cdgsব☊☍☝☨c;檨otĀ;o☔☕橿Ā;r☚☛檁;檃Ā;e☢☥쀀⋚︀s;檓ʀadegs☳☹☽♉♋pproøⓆot;拖qĀgq♃♅ôউgtò⒌ôছiíলƀilr♕࣡♚sht;楼;쀀𝔩Ā;Eজ♣;檑š♩♶rĀdu▲♮Ā;l॥♳;楪lk;斄cy;䑙ʀ;achtੈ⚈⚋⚑⚖rò◁orneòᴈard;楫ri;旺Āio⚟⚤dot;䅀ustĀ;a⚬⚭掰che»⚭ȀEaes⚻⚽⛉⛔;扨pĀ;p⛃⛄檉rox»⛄Ā;q⛎⛏檇Ā;q⛎⚻im;拦Ѐabnoptwz⛩⛴⛷✚✯❁❇❐Ānr⛮⛱g;柬r;懽rëࣁgƀlmr⛿✍✔eftĀar০✇ightá৲apsto;柼ightá৽parrowĀlr✥✩efô⓭ight;憬ƀafl✶✹✽r;榅;쀀𝕝us;樭imes;樴š❋❏st;戗áፎƀ;ef❗❘᠀旊nge»❘arĀ;l❤❥䀨t;榓ʀachmt❳❶❼➅➇ròࢨorneòᶌarĀ;d྘➃;業;怎ri;抿̀achiqt➘➝ੀ➢➮➻quo;怹r;쀀𝓁mƀ;egল➪➬;檍;檏Ābu┪➳oĀ;rฟ➹;怚rok;䅂萀<;cdhilqrࠫ⟒☹⟜⟠⟥⟪⟰Āci⟗⟙;檦r;橹reå◲mes;拉arr;楶uest;橻ĀPi⟵⟹ar;榖ƀ;ef⠀भ᠛旃rĀdu⠇⠍shar;楊har;楦Āen⠗⠡rtneqq;쀀≨︀Å⠞܀Dacdefhilnopsu⡀⡅⢂⢎⢓⢠⢥⢨⣚⣢⣤ઃ⣳⤂Dot;戺Ȁclpr⡎⡒⡣⡽r耻¯䂯Āet⡗⡙;時Ā;e⡞⡟朠se»⡟Ā;sျ⡨toȀ;dluျ⡳⡷⡻owîҌefôएðᏑker;斮Āoy⢇⢌mma;権;䐼ash;怔asuredangle»ᘦr;쀀𝔪o;愧ƀcdn⢯⢴⣉ro耻µ䂵Ȁ;acdᑤ⢽⣀⣄sôᚧir;櫰ot肻·Ƶusƀ;bd⣒ᤃ⣓戒Ā;uᴼ⣘;横ţ⣞⣡p;櫛ò−ðઁĀdp⣩⣮els;抧f;쀀𝕞Āct⣸⣽r;쀀𝓂pos»ᖝƀ;lm⤉⤊⤍䎼timap;抸ఀGLRVabcdefghijlmoprstuvw⥂⥓⥾⦉⦘⧚⧩⨕⨚⩘⩝⪃⪕⪤⪨⬄⬇⭄⭿⮮ⰴⱧⱼ⳩Āgt⥇⥋;쀀⋙̸Ā;v⥐௏쀀≫⃒ƀelt⥚⥲⥶ftĀar⥡⥧rrow;懍ightarrow;懎;쀀⋘̸Ā;v⥻ే쀀≪⃒ightarrow;懏ĀDd⦎⦓ash;抯ash;抮ʀbcnpt⦣⦧⦬⦱⧌la»˞ute;䅄g;쀀∠⃒ʀ;Eiop඄⦼⧀⧅⧈;쀀⩰̸d;쀀≋̸s;䅉roø඄urĀ;a⧓⧔普lĀ;s⧓ସǳ⧟\0⧣p肻 ଷmpĀ;e௹ఀʀaeouy⧴⧾⨃⨐⨓ǰ⧹\0⧻;橃on;䅈dil;䅆ngĀ;dൾ⨊ot;쀀⩭̸p;橂;䐽ash;怓΀;Aadqsxஒ⨩⨭⨻⩁⩅⩐rr;懗rĀhr⨳⨶k;椤Ā;oᏲᏰot;쀀≐̸uiöୣĀei⩊⩎ar;椨í஘istĀ;s஠டr;쀀𝔫ȀEest௅⩦⩹⩼ƀ;qs஼⩭௡ƀ;qs஼௅⩴lanô௢ií௪Ā;rஶ⪁»ஷƀAap⪊⪍⪑rò⥱rr;憮ar;櫲ƀ;svྍ⪜ྌĀ;d⪡⪢拼;拺cy;䑚΀AEadest⪷⪺⪾⫂⫅⫶⫹rò⥦;쀀≦̸rr;憚r;急Ȁ;fqs఻⫎⫣⫯tĀar⫔⫙rro÷⫁ightarro÷⪐ƀ;qs఻⪺⫪lanôౕĀ;sౕ⫴»శiíౝĀ;rవ⫾iĀ;eచథiäඐĀpt⬌⬑f;쀀𝕟膀¬;in⬙⬚⬶䂬nȀ;Edvஉ⬤⬨⬮;쀀⋹̸ot;쀀⋵̸ǡஉ⬳⬵;拷;拶iĀ;vಸ⬼ǡಸ⭁⭃;拾;拽ƀaor⭋⭣⭩rȀ;ast୻⭕⭚⭟lleì୻l;쀀⫽⃥;쀀∂̸lint;樔ƀ;ceಒ⭰⭳uåಥĀ;cಘ⭸Ā;eಒ⭽ñಘȀAait⮈⮋⮝⮧rò⦈rrƀ;cw⮔⮕⮙憛;쀀⤳̸;쀀↝̸ghtarrow»⮕riĀ;eೋೖ΀chimpqu⮽⯍⯙⬄୸⯤⯯Ȁ;cerല⯆ഷ⯉uå൅;쀀𝓃ortɭ⬅\0\0⯖ará⭖mĀ;e൮⯟Ā;q൴൳suĀbp⯫⯭å೸åഋƀbcp⯶ⰑⰙȀ;Ees⯿ⰀഢⰄ抄;쀀⫅̸etĀ;eഛⰋqĀ;qണⰀcĀ;eലⰗñസȀ;EesⰢⰣൟⰧ抅;쀀⫆̸etĀ;e൘ⰮqĀ;qൠⰣȀgilrⰽⰿⱅⱇìௗlde耻ñ䃱çృiangleĀlrⱒⱜeftĀ;eచⱚñదightĀ;eೋⱥñ೗Ā;mⱬⱭ䎽ƀ;esⱴⱵⱹ䀣ro;愖p;怇ҀDHadgilrsⲏⲔⲙⲞⲣⲰⲶⳓⳣash;抭arr;椄p;쀀≍⃒ash;抬ĀetⲨⲬ;쀀≥⃒;쀀>⃒nfin;槞ƀAetⲽⳁⳅrr;椂;쀀≤⃒Ā;rⳊⳍ쀀<⃒ie;쀀⊴⃒ĀAtⳘⳜrr;椃rie;쀀⊵⃒im;쀀∼⃒ƀAan⳰⳴ⴂrr;懖rĀhr⳺⳽k;椣Ā;oᏧᏥear;椧ቓ᪕\0\0\0\0\0\0\0\0\0\0\0\0\0ⴭ\0ⴸⵈⵠⵥ⵲ⶄᬇ\0\0ⶍⶫ\0ⷈⷎ\0ⷜ⸙⸫⸾⹃Ācsⴱ᪗ute耻ó䃳ĀiyⴼⵅrĀ;c᪞ⵂ耻ô䃴;䐾ʀabios᪠ⵒⵗǈⵚlac;䅑v;樸old;榼lig;䅓Ācr⵩⵭ir;榿;쀀𝔬ͯ⵹\0\0⵼\0ⶂn;䋛ave耻ò䃲;槁Ābmⶈ෴ar;榵Ȁacitⶕ⶘ⶥⶨrò᪀Āir⶝ⶠr;榾oss;榻nå๒;槀ƀaeiⶱⶵⶹcr;䅍ga;䏉ƀcdnⷀⷅǍron;䎿;榶pf;쀀𝕠ƀaelⷔ⷗ǒr;榷rp;榹΀;adiosvⷪⷫⷮ⸈⸍⸐⸖戨rò᪆Ȁ;efmⷷⷸ⸂⸅橝rĀ;oⷾⷿ愴f»ⷿ耻ª䂪耻º䂺gof;抶r;橖lope;橗;橛ƀclo⸟⸡⸧ò⸁ash耻ø䃸l;折iŬⸯ⸴de耻õ䃵esĀ;aǛ⸺s;樶ml耻ö䃶bar;挽ૡ⹞\0⹽\0⺀⺝\0⺢⺹\0\0⻋ຜ\0⼓\0\0⼫⾼\0⿈rȀ;astЃ⹧⹲຅脀¶;l⹭⹮䂶leìЃɩ⹸\0\0⹻m;櫳;櫽y;䐿rʀcimpt⺋⺏⺓ᡥ⺗nt;䀥od;䀮il;怰enk;怱r;쀀𝔭ƀimo⺨⺰⺴Ā;v⺭⺮䏆;䏕maô੶ne;明ƀ;tv⺿⻀⻈䏀chfork»´;䏖Āau⻏⻟nĀck⻕⻝kĀ;h⇴⻛;愎ö⇴sҀ;abcdemst⻳⻴ᤈ⻹⻽⼄⼆⼊⼎䀫cir;樣ir;樢Āouᵀ⼂;樥;橲n肻±ຝim;樦wo;樧ƀipu⼙⼠⼥ntint;樕f;쀀𝕡nd耻£䂣Ԁ;Eaceinosu່⼿⽁⽄⽇⾁⾉⾒⽾⾶;檳p;檷uå໙Ā;c໎⽌̀;acens່⽙⽟⽦⽨⽾pproø⽃urlyeñ໙ñ໎ƀaes⽯⽶⽺pprox;檹qq;檵im;拨iíໟmeĀ;s⾈ຮ怲ƀEas⽸⾐⽺ð⽵ƀdfp໬⾙⾯ƀals⾠⾥⾪lar;挮ine;挒urf;挓Ā;t໻⾴ï໻rel;抰Āci⿀⿅r;쀀𝓅;䏈ncsp;怈̀fiopsu⿚⋢⿟⿥⿫⿱r;쀀𝔮pf;쀀𝕢rime;恗cr;쀀𝓆ƀaeo⿸〉〓tĀei⿾々rnionóڰnt;樖stĀ;e【】䀿ñἙô༔઀ABHabcdefhilmnoprstux぀けさすムㄎㄫㅇㅢㅲㆎ㈆㈕㈤㈩㉘㉮㉲㊐㊰㊷ƀartぇおがròႳòϝail;検aròᱥar;楤΀cdenqrtとふへみわゔヌĀeuねぱ;쀀∽̱te;䅕iãᅮmptyv;榳gȀ;del࿑らるろ;榒;榥å࿑uo耻»䂻rր;abcfhlpstw࿜ガクシスゼゾダッデナp;極Ā;f࿠ゴs;椠;椳s;椞ë≝ð✮l;楅im;楴l;憣;憝Āaiパフil;椚oĀ;nホボ戶aló༞ƀabrョリヮrò៥rk;杳ĀakンヽcĀekヹ・;䁽;䁝Āes㄂㄄;榌lĀduㄊㄌ;榎;榐Ȁaeuyㄗㄜㄧㄩron;䅙Ādiㄡㄥil;䅗ì࿲âヺ;䑀Ȁclqsㄴㄷㄽㅄa;椷dhar;楩uoĀ;rȎȍh;憳ƀacgㅎㅟངlȀ;ipsླྀㅘㅛႜnåႻarôྩt;断ƀilrㅩဣㅮsht;楽;쀀𝔯ĀaoㅷㆆrĀduㅽㅿ»ѻĀ;l႑ㆄ;楬Ā;vㆋㆌ䏁;䏱ƀgns㆕ㇹㇼht̀ahlrstㆤㆰ㇂㇘㇤㇮rrowĀ;t࿜ㆭaéトarpoonĀduㆻㆿowîㅾp»႒eftĀah㇊㇐rrowó࿪arpoonóՑightarrows;應quigarro÷ニhreetimes;拌g;䋚ingdotseñἲƀahm㈍㈐㈓rò࿪aòՑ;怏oustĀ;a㈞㈟掱che»㈟mid;櫮Ȁabpt㈲㈽㉀㉒Ānr㈷㈺g;柭r;懾rëဃƀafl㉇㉊㉎r;榆;쀀𝕣us;樮imes;樵Āap㉝㉧rĀ;g㉣㉤䀩t;榔olint;樒arò㇣Ȁachq㉻㊀Ⴜ㊅quo;怺r;쀀𝓇Ābu・㊊oĀ;rȔȓƀhir㊗㊛㊠reåㇸmes;拊iȀ;efl㊪ၙᠡ㊫方tri;槎luhar;楨;愞ൡ㋕㋛㋟㌬㌸㍱\0㍺㎤\0\0㏬㏰\0㐨㑈㑚㒭㒱㓊㓱\0㘖\0\0㘳cute;䅛quï➺Ԁ;Eaceinpsyᇭ㋳㋵㋿㌂㌋㌏㌟㌦㌩;檴ǰ㋺\0㋼;檸on;䅡uåᇾĀ;dᇳ㌇il;䅟rc;䅝ƀEas㌖㌘㌛;檶p;檺im;择olint;樓iíሄ;䑁otƀ;be㌴ᵇ㌵担;橦΀Aacmstx㍆㍊㍗㍛㍞㍣㍭rr;懘rĀhr㍐㍒ë∨Ā;oਸ਼਴t耻§䂧i;䀻war;椩mĀin㍩ðnuóñt;朶rĀ;o㍶⁕쀀𝔰Ȁacoy㎂㎆㎑㎠rp;景Āhy㎋㎏cy;䑉;䑈rtɭ㎙\0\0㎜iäᑤaraì⹯耻­䂭Āgm㎨㎴maƀ;fv㎱㎲㎲䏃;䏂Ѐ;deglnprካ㏅㏉㏎㏖㏞㏡㏦ot;橪Ā;q኱ኰĀ;E㏓㏔檞;檠Ā;E㏛㏜檝;檟e;扆lus;樤arr;楲aròᄽȀaeit㏸㐈㐏㐗Āls㏽㐄lsetmé㍪hp;樳parsl;槤Ādlᑣ㐔e;挣Ā;e㐜㐝檪Ā;s㐢㐣檬;쀀⪬︀ƀflp㐮㐳㑂tcy;䑌Ā;b㐸㐹䀯Ā;a㐾㐿槄r;挿f;쀀𝕤aĀdr㑍ЂesĀ;u㑔㑕晠it»㑕ƀcsu㑠㑹㒟Āau㑥㑯pĀ;sᆈ㑫;쀀⊓︀pĀ;sᆴ㑵;쀀⊔︀uĀbp㑿㒏ƀ;esᆗᆜ㒆etĀ;eᆗ㒍ñᆝƀ;esᆨᆭ㒖etĀ;eᆨ㒝ñᆮƀ;afᅻ㒦ְrť㒫ֱ»ᅼaròᅈȀcemt㒹㒾㓂㓅r;쀀𝓈tmîñiì㐕aræᆾĀar㓎㓕rĀ;f㓔ឿ昆Āan㓚㓭ightĀep㓣㓪psiloîỠhé⺯s»⡒ʀbcmnp㓻㕞ሉ㖋㖎Ҁ;Edemnprs㔎㔏㔑㔕㔞㔣㔬㔱㔶抂;櫅ot;檽Ā;dᇚ㔚ot;櫃ult;櫁ĀEe㔨㔪;櫋;把lus;檿arr;楹ƀeiu㔽㕒㕕tƀ;en㔎㕅㕋qĀ;qᇚ㔏eqĀ;q㔫㔨m;櫇Ābp㕚㕜;櫕;櫓c̀;acensᇭ㕬㕲㕹㕻㌦pproø㋺urlyeñᇾñᇳƀaes㖂㖈㌛pproø㌚qñ㌗g;晪ڀ123;Edehlmnps㖩㖬㖯ሜ㖲㖴㗀㗉㗕㗚㗟㗨㗭耻¹䂹耻²䂲耻³䂳;櫆Āos㖹㖼t;檾ub;櫘Ā;dሢ㗅ot;櫄sĀou㗏㗒l;柉b;櫗arr;楻ult;櫂ĀEe㗤㗦;櫌;抋lus;櫀ƀeiu㗴㘉㘌tƀ;enሜ㗼㘂qĀ;qሢ㖲eqĀ;q㗧㗤m;櫈Ābp㘑㘓;櫔;櫖ƀAan㘜㘠㘭rr;懙rĀhr㘦㘨ë∮Ā;oਫ਩war;椪lig耻ß䃟௡㙑㙝㙠ዎ㙳㙹\0㙾㛂\0\0\0\0\0㛛㜃\0㜉㝬\0\0\0㞇ɲ㙖\0\0㙛get;挖;䏄rë๟ƀaey㙦㙫㙰ron;䅥dil;䅣;䑂lrec;挕r;쀀𝔱Ȁeiko㚆㚝㚵㚼ǲ㚋\0㚑eĀ4fኄኁaƀ;sv㚘㚙㚛䎸ym;䏑Ācn㚢㚲kĀas㚨㚮pproø዁im»ኬsðኞĀas㚺㚮ð዁rn耻þ䃾Ǭ̟㛆⋧es膀×;bd㛏㛐㛘䃗Ā;aᤏ㛕r;樱;樰ƀeps㛡㛣㜀á⩍Ȁ;bcf҆㛬㛰㛴ot;挶ir;櫱Ā;o㛹㛼쀀𝕥rk;櫚á㍢rime;怴ƀaip㜏㜒㝤dåቈ΀adempst㜡㝍㝀㝑㝗㝜㝟ngleʀ;dlqr㜰㜱㜶㝀㝂斵own»ᶻeftĀ;e⠀㜾ñम;扜ightĀ;e㊪㝋ñၚot;旬inus;樺lus;樹b;槍ime;樻ezium;揢ƀcht㝲㝽㞁Āry㝷㝻;쀀𝓉;䑆cy;䑛rok;䅧Āio㞋㞎xô᝷headĀlr㞗㞠eftarro÷ࡏightarrow»ཝऀAHabcdfghlmoprstuw㟐㟓㟗㟤㟰㟼㠎㠜㠣㠴㡑㡝㡫㢩㣌㣒㣪㣶ròϭar;楣Ācr㟜㟢ute耻ú䃺òᅐrǣ㟪\0㟭y;䑞ve;䅭Āiy㟵㟺rc耻û䃻;䑃ƀabh㠃㠆㠋ròᎭlac;䅱aòᏃĀir㠓㠘sht;楾;쀀𝔲rave耻ù䃹š㠧㠱rĀlr㠬㠮»ॗ»ႃlk;斀Āct㠹㡍ɯ㠿\0\0㡊rnĀ;e㡅㡆挜r»㡆op;挏ri;旸Āal㡖㡚cr;䅫肻¨͉Āgp㡢㡦on;䅳f;쀀𝕦̀adhlsuᅋ㡸㡽፲㢑㢠ownáᎳarpoonĀlr㢈㢌efô㠭ighô㠯iƀ;hl㢙㢚㢜䏅»ᏺon»㢚parrows;懈ƀcit㢰㣄㣈ɯ㢶\0\0㣁rnĀ;e㢼㢽挝r»㢽op;挎ng;䅯ri;旹cr;쀀𝓊ƀdir㣙㣝㣢ot;拰lde;䅩iĀ;f㜰㣨»᠓Āam㣯㣲rò㢨l耻ü䃼angle;榧ހABDacdeflnoprsz㤜㤟㤩㤭㦵㦸㦽㧟㧤㧨㧳㧹㧽㨁㨠ròϷarĀ;v㤦㤧櫨;櫩asèϡĀnr㤲㤷grt;榜΀eknprst㓣㥆㥋㥒㥝㥤㦖appá␕othinçẖƀhir㓫⻈㥙opô⾵Ā;hᎷ㥢ïㆍĀiu㥩㥭gmá㎳Ābp㥲㦄setneqĀ;q㥽㦀쀀⊊︀;쀀⫋︀setneqĀ;q㦏㦒쀀⊋︀;쀀⫌︀Āhr㦛㦟etá㚜iangleĀlr㦪㦯eft»थight»ၑy;䐲ash»ံƀelr㧄㧒㧗ƀ;beⷪ㧋㧏ar;抻q;扚lip;拮Ābt㧜ᑨaòᑩr;쀀𝔳tré㦮suĀbp㧯㧱»ജ»൙pf;쀀𝕧roð໻tré㦴Ācu㨆㨋r;쀀𝓋Ābp㨐㨘nĀEe㦀㨖»㥾nĀEe㦒㨞»㦐igzag;榚΀cefoprs㨶㨻㩖㩛㩔㩡㩪irc;䅵Ādi㩀㩑Ābg㩅㩉ar;機eĀ;qᗺ㩏;扙erp;愘r;쀀𝔴pf;쀀𝕨Ā;eᑹ㩦atèᑹcr;쀀𝓌ૣណ㪇\0㪋\0㪐㪛\0\0㪝㪨㪫㪯\0\0㫃㫎\0㫘ៜ៟tré៑r;쀀𝔵ĀAa㪔㪗ròσrò৶;䎾ĀAa㪡㪤ròθrò৫að✓is;拻ƀdptឤ㪵㪾Āfl㪺ឩ;쀀𝕩imåឲĀAa㫇㫊ròώròਁĀcq㫒ីr;쀀𝓍Āpt៖㫜ré។Ѐacefiosu㫰㫽㬈㬌㬑㬕㬛㬡cĀuy㫶㫻te耻ý䃽;䑏Āiy㬂㬆rc;䅷;䑋n耻¥䂥r;쀀𝔶cy;䑗pf;쀀𝕪cr;쀀𝓎Ācm㬦㬩y;䑎l耻ÿ䃿Ԁacdefhiosw㭂㭈㭔㭘㭤㭩㭭㭴㭺㮀cute;䅺Āay㭍㭒ron;䅾;䐷ot;䅼Āet㭝㭡træᕟa;䎶r;쀀𝔷cy;䐶grarr;懝pf;쀀𝕫cr;쀀𝓏Ājn㮅㮇;怍j;怌'.split("").map((function(e){return e.charCodeAt(0)})));var p={};Object.defineProperty(p,"__esModule",{value:!0}),p.default=new Uint16Array("Ȁaglq\tɭ\0\0p;䀦os;䀧t;䀾t;䀼uot;䀢".split("").map((function(e){return e.charCodeAt(0)})));var u,N,I,C,S,D={};!function(e){var t;Object.defineProperty(e,"__esModule",{value:!0}),e.replaceCodePoint=e.fromCodePoint=void 0;var s=new Map([[0,65533],[128,8364],[130,8218],[131,402],[132,8222],[133,8230],[134,8224],[135,8225],[136,710],[137,8240],[138,352],[139,8249],[140,338],[142,381],[145,8216],[146,8217],[147,8220],[148,8221],[149,8226],[150,8211],[151,8212],[152,732],[153,8482],[154,353],[155,8250],[156,339],[158,382],[159,376]]);function a(e){var t;return e>=55296&&e<=57343||e>1114111?65533:null!==(t=s.get(e))&&void 0!==t?t:e}e.fromCodePoint=null!==(t=String.fromCodePoint)&&void 0!==t?t:function(e){var t="";return e>65535&&(e-=65536,t+=String.fromCharCode(e>>>10&1023|55296),e=56320|1023&e),t+String.fromCharCode(e)},e.replaceCodePoint=a,e.default=function(t){return (0, e.fromCodePoint)(a(t))};}(D),function(e){var t=l&&l.__createBinding||(Object.create?function(e,t,s,a){void 0===a&&(a=s);var r=Object.getOwnPropertyDescriptor(t,s);r&&!("get"in r?!t.__esModule:r.writable||r.configurable)||(r={enumerable:!0,get:function(){return t[s]}}),Object.defineProperty(e,a,r);}:function(e,t,s,a){void 0===a&&(a=s),e[a]=t[s];}),s=l&&l.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t});}:function(e,t){e.default=t;}),a=l&&l.__importStar||function(e){if(e&&e.__esModule)return e;var a={};if(null!=e)for(var r in e)"default"!==r&&Object.prototype.hasOwnProperty.call(e,r)&&t(a,e,r);return s(a,e),a},r=l&&l.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(e,"__esModule",{value:!0}),e.decodeXML=e.decodeHTMLStrict=e.decodeHTMLAttribute=e.decodeHTML=e.determineBranch=e.EntityDecoder=e.DecodingMode=e.BinTrieFlags=e.fromCodePoint=e.replaceCodePoint=e.decodeCodePoint=e.xmlDecodeTree=e.htmlDecodeTree=void 0;var n=r(d);e.htmlDecodeTree=n.default;var i=r(p);e.xmlDecodeTree=i.default;var o=a(D);e.decodeCodePoint=o.default;var c,E,T,h,_=D;function A(e){return e>=c.ZERO&&e<=c.NINE}Object.defineProperty(e,"replaceCodePoint",{enumerable:!0,get:function(){return _.replaceCodePoint}}),Object.defineProperty(e,"fromCodePoint",{enumerable:!0,get:function(){return _.fromCodePoint}}),function(e){e[e.NUM=35]="NUM",e[e.SEMI=59]="SEMI",e[e.EQUALS=61]="EQUALS",e[e.ZERO=48]="ZERO",e[e.NINE=57]="NINE",e[e.LOWER_A=97]="LOWER_A",e[e.LOWER_F=102]="LOWER_F",e[e.LOWER_X=120]="LOWER_X",e[e.LOWER_Z=122]="LOWER_Z",e[e.UPPER_A=65]="UPPER_A",e[e.UPPER_F=70]="UPPER_F",e[e.UPPER_Z=90]="UPPER_Z";}(c||(c={})),function(e){e[e.VALUE_LENGTH=49152]="VALUE_LENGTH",e[e.BRANCH_LENGTH=16256]="BRANCH_LENGTH",e[e.JUMP_TABLE=127]="JUMP_TABLE";}(E=e.BinTrieFlags||(e.BinTrieFlags={})),function(e){e[e.EntityStart=0]="EntityStart",e[e.NumericStart=1]="NumericStart",e[e.NumericDecimal=2]="NumericDecimal",e[e.NumericHex=3]="NumericHex",e[e.NamedEntity=4]="NamedEntity";}(T||(T={})),function(e){e[e.Legacy=0]="Legacy",e[e.Strict=1]="Strict",e[e.Attribute=2]="Attribute";}(h=e.DecodingMode||(e.DecodingMode={}));var m=function(){function e(e,t,s){this.decodeTree=e,this.emitCodePoint=t,this.errors=s,this.state=T.EntityStart,this.consumed=1,this.result=0,this.treeIndex=0,this.excess=1,this.decodeMode=h.Strict;}return e.prototype.startEntity=function(e){this.decodeMode=e,this.state=T.EntityStart,this.result=0,this.treeIndex=0,this.excess=1,this.consumed=1;},e.prototype.write=function(e,t){switch(this.state){case T.EntityStart:return e.charCodeAt(t)===c.NUM?(this.state=T.NumericStart,this.consumed+=1,this.stateNumericStart(e,t+1)):(this.state=T.NamedEntity,this.stateNamedEntity(e,t));case T.NumericStart:return this.stateNumericStart(e,t);case T.NumericDecimal:return this.stateNumericDecimal(e,t);case T.NumericHex:return this.stateNumericHex(e,t);case T.NamedEntity:return this.stateNamedEntity(e,t)}},e.prototype.stateNumericStart=function(e,t){return t>=e.length?-1:(32|e.charCodeAt(t))===c.LOWER_X?(this.state=T.NumericHex,this.consumed+=1,this.stateNumericHex(e,t+1)):(this.state=T.NumericDecimal,this.stateNumericDecimal(e,t))},e.prototype.addToNumericResult=function(e,t,s,a){if(t!==s){var r=s-t;this.result=this.result*Math.pow(a,r)+parseInt(e.substr(t,r),a),this.consumed+=r;}},e.prototype.stateNumericHex=function(e,t){for(var s,a=t;t<e.length;){var r=e.charCodeAt(t);if(!(A(r)||(s=r,s>=c.UPPER_A&&s<=c.UPPER_F||s>=c.LOWER_A&&s<=c.LOWER_F)))return this.addToNumericResult(e,a,t,16),this.emitNumericEntity(r,3);t+=1;}return this.addToNumericResult(e,a,t,16),-1},e.prototype.stateNumericDecimal=function(e,t){for(var s=t;t<e.length;){var a=e.charCodeAt(t);if(!A(a))return this.addToNumericResult(e,s,t,10),this.emitNumericEntity(a,2);t+=1;}return this.addToNumericResult(e,s,t,10),-1},e.prototype.emitNumericEntity=function(e,t){var s;if(this.consumed<=t)return null===(s=this.errors)||void 0===s||s.absenceOfDigitsInNumericCharacterReference(this.consumed),0;if(e===c.SEMI)this.consumed+=1;else if(this.decodeMode===h.Strict)return 0;return this.emitCodePoint((0, o.replaceCodePoint)(this.result),this.consumed),this.errors&&(e!==c.SEMI&&this.errors.missingSemicolonAfterCharacterReference(),this.errors.validateNumericCharacterReference(this.result)),this.consumed},e.prototype.stateNamedEntity=function(e,t){for(var s=this.decodeTree,a=s[this.treeIndex],r=(a&E.VALUE_LENGTH)>>14;t<e.length;t++,this.excess++){var n=e.charCodeAt(t);if(this.treeIndex=N(s,a,this.treeIndex+Math.max(1,r),n),this.treeIndex<0)return 0===this.result||this.decodeMode===h.Attribute&&(0===r||((i=n)===c.EQUALS||function(e){return e>=c.UPPER_A&&e<=c.UPPER_Z||e>=c.LOWER_A&&e<=c.LOWER_Z||A(e)}(i)))?0:this.emitNotTerminatedNamedEntity();if(0!=(r=((a=s[this.treeIndex])&E.VALUE_LENGTH)>>14)){if(n===c.SEMI)return this.emitNamedEntityData(this.treeIndex,r,this.consumed+this.excess);this.decodeMode!==h.Strict&&(this.result=this.treeIndex,this.consumed+=this.excess,this.excess=0);}}var i;return -1},e.prototype.emitNotTerminatedNamedEntity=function(){var e,t=this.result,s=(this.decodeTree[t]&E.VALUE_LENGTH)>>14;return this.emitNamedEntityData(t,s,this.consumed),null===(e=this.errors)||void 0===e||e.missingSemicolonAfterCharacterReference(),this.consumed},e.prototype.emitNamedEntityData=function(e,t,s){var a=this.decodeTree;return this.emitCodePoint(1===t?a[e]&~E.VALUE_LENGTH:a[e+1],s),3===t&&this.emitCodePoint(a[e+2],s),s},e.prototype.end=function(){var e;switch(this.state){case T.NamedEntity:return 0===this.result||this.decodeMode===h.Attribute&&this.result!==this.treeIndex?0:this.emitNotTerminatedNamedEntity();case T.NumericDecimal:return this.emitNumericEntity(0,2);case T.NumericHex:return this.emitNumericEntity(0,3);case T.NumericStart:return null===(e=this.errors)||void 0===e||e.absenceOfDigitsInNumericCharacterReference(this.consumed),0;case T.EntityStart:return 0}},e}();function u(e){var t="",s=new m(e,(function(e){return t+=(0, o.fromCodePoint)(e)}));return function(e,a){for(var r=0,n=0;(n=e.indexOf("&",n))>=0;){t+=e.slice(r,n),s.startEntity(a);var i=s.write(e,n+1);if(i<0){r=n+s.end();break}r=n+i,n=0===i?r+1:r;}var o=t+e.slice(r);return t="",o}}function N(e,t,s,a){var r=(t&E.BRANCH_LENGTH)>>7,n=t&E.JUMP_TABLE;if(0===r)return 0!==n&&a===n?s:-1;if(n){var i=a-n;return i<0||i>=r?-1:e[s+i]-1}for(var o=s,c=o+r-1;o<=c;){var T=o+c>>>1,h=e[T];if(h<a)o=T+1;else {if(!(h>a))return e[T+r];c=T-1;}}return -1}e.EntityDecoder=m,e.determineBranch=N;var I=u(n.default),C=u(i.default);e.decodeHTML=function(e,t){return void 0===t&&(t=h.Legacy),I(e,t)},e.decodeHTMLAttribute=function(e){return I(e,h.Attribute)},e.decodeHTMLStrict=function(e){return I(e,h.Strict)},e.decodeXML=function(e){return C(e,h.Strict)};}(m),function(e){e.HTML="http://www.w3.org/1999/xhtml",e.MATHML="http://www.w3.org/1998/Math/MathML",e.SVG="http://www.w3.org/2000/svg",e.XLINK="http://www.w3.org/1999/xlink",e.XML="http://www.w3.org/XML/1998/namespace",e.XMLNS="http://www.w3.org/2000/xmlns/";}(u=u||(u={})),function(e){e.TYPE="type",e.ACTION="action",e.ENCODING="encoding",e.PROMPT="prompt",e.NAME="name",e.COLOR="color",e.FACE="face",e.SIZE="size";}(N=N||(N={})),function(e){e.NO_QUIRKS="no-quirks",e.QUIRKS="quirks",e.LIMITED_QUIRKS="limited-quirks";}(I=I||(I={})),function(e){e.A="a",e.ADDRESS="address",e.ANNOTATION_XML="annotation-xml",e.APPLET="applet",e.AREA="area",e.ARTICLE="article",e.ASIDE="aside",e.B="b",e.BASE="base",e.BASEFONT="basefont",e.BGSOUND="bgsound",e.BIG="big",e.BLOCKQUOTE="blockquote",e.BODY="body",e.BR="br",e.BUTTON="button",e.CAPTION="caption",e.CENTER="center",e.CODE="code",e.COL="col",e.COLGROUP="colgroup",e.DD="dd",e.DESC="desc",e.DETAILS="details",e.DIALOG="dialog",e.DIR="dir",e.DIV="div",e.DL="dl",e.DT="dt",e.EM="em",e.EMBED="embed",e.FIELDSET="fieldset",e.FIGCAPTION="figcaption",e.FIGURE="figure",e.FONT="font",e.FOOTER="footer",e.FOREIGN_OBJECT="foreignObject",e.FORM="form",e.FRAME="frame",e.FRAMESET="frameset",e.H1="h1",e.H2="h2",e.H3="h3",e.H4="h4",e.H5="h5",e.H6="h6",e.HEAD="head",e.HEADER="header",e.HGROUP="hgroup",e.HR="hr",e.HTML="html",e.I="i",e.IMG="img",e.IMAGE="image",e.INPUT="input",e.IFRAME="iframe",e.KEYGEN="keygen",e.LABEL="label",e.LI="li",e.LINK="link",e.LISTING="listing",e.MAIN="main",e.MALIGNMARK="malignmark",e.MARQUEE="marquee",e.MATH="math",e.MENU="menu",e.META="meta",e.MGLYPH="mglyph",e.MI="mi",e.MO="mo",e.MN="mn",e.MS="ms",e.MTEXT="mtext",e.NAV="nav",e.NOBR="nobr",e.NOFRAMES="noframes",e.NOEMBED="noembed",e.NOSCRIPT="noscript",e.OBJECT="object",e.OL="ol",e.OPTGROUP="optgroup",e.OPTION="option",e.P="p",e.PARAM="param",e.PLAINTEXT="plaintext",e.PRE="pre",e.RB="rb",e.RP="rp",e.RT="rt",e.RTC="rtc",e.RUBY="ruby",e.S="s",e.SCRIPT="script",e.SECTION="section",e.SELECT="select",e.SOURCE="source",e.SMALL="small",e.SPAN="span",e.STRIKE="strike",e.STRONG="strong",e.STYLE="style",e.SUB="sub",e.SUMMARY="summary",e.SUP="sup",e.TABLE="table",e.TBODY="tbody",e.TEMPLATE="template",e.TEXTAREA="textarea",e.TFOOT="tfoot",e.TD="td",e.TH="th",e.THEAD="thead",e.TITLE="title",e.TR="tr",e.TRACK="track",e.TT="tt",e.U="u",e.UL="ul",e.SVG="svg",e.VAR="var",e.WBR="wbr",e.XMP="xmp";}(C=C||(C={})),function(e){e[e.UNKNOWN=0]="UNKNOWN",e[e.A=1]="A",e[e.ADDRESS=2]="ADDRESS",e[e.ANNOTATION_XML=3]="ANNOTATION_XML",e[e.APPLET=4]="APPLET",e[e.AREA=5]="AREA",e[e.ARTICLE=6]="ARTICLE",e[e.ASIDE=7]="ASIDE",e[e.B=8]="B",e[e.BASE=9]="BASE",e[e.BASEFONT=10]="BASEFONT",e[e.BGSOUND=11]="BGSOUND",e[e.BIG=12]="BIG",e[e.BLOCKQUOTE=13]="BLOCKQUOTE",e[e.BODY=14]="BODY",e[e.BR=15]="BR",e[e.BUTTON=16]="BUTTON",e[e.CAPTION=17]="CAPTION",e[e.CENTER=18]="CENTER",e[e.CODE=19]="CODE",e[e.COL=20]="COL",e[e.COLGROUP=21]="COLGROUP",e[e.DD=22]="DD",e[e.DESC=23]="DESC",e[e.DETAILS=24]="DETAILS",e[e.DIALOG=25]="DIALOG",e[e.DIR=26]="DIR",e[e.DIV=27]="DIV",e[e.DL=28]="DL",e[e.DT=29]="DT",e[e.EM=30]="EM",e[e.EMBED=31]="EMBED",e[e.FIELDSET=32]="FIELDSET",e[e.FIGCAPTION=33]="FIGCAPTION",e[e.FIGURE=34]="FIGURE",e[e.FONT=35]="FONT",e[e.FOOTER=36]="FOOTER",e[e.FOREIGN_OBJECT=37]="FOREIGN_OBJECT",e[e.FORM=38]="FORM",e[e.FRAME=39]="FRAME",e[e.FRAMESET=40]="FRAMESET",e[e.H1=41]="H1",e[e.H2=42]="H2",e[e.H3=43]="H3",e[e.H4=44]="H4",e[e.H5=45]="H5",e[e.H6=46]="H6",e[e.HEAD=47]="HEAD",e[e.HEADER=48]="HEADER",e[e.HGROUP=49]="HGROUP",e[e.HR=50]="HR",e[e.HTML=51]="HTML",e[e.I=52]="I",e[e.IMG=53]="IMG",e[e.IMAGE=54]="IMAGE",e[e.INPUT=55]="INPUT",e[e.IFRAME=56]="IFRAME",e[e.KEYGEN=57]="KEYGEN",e[e.LABEL=58]="LABEL",e[e.LI=59]="LI",e[e.LINK=60]="LINK",e[e.LISTING=61]="LISTING",e[e.MAIN=62]="MAIN",e[e.MALIGNMARK=63]="MALIGNMARK",e[e.MARQUEE=64]="MARQUEE",e[e.MATH=65]="MATH",e[e.MENU=66]="MENU",e[e.META=67]="META",e[e.MGLYPH=68]="MGLYPH",e[e.MI=69]="MI",e[e.MO=70]="MO",e[e.MN=71]="MN",e[e.MS=72]="MS",e[e.MTEXT=73]="MTEXT",e[e.NAV=74]="NAV",e[e.NOBR=75]="NOBR",e[e.NOFRAMES=76]="NOFRAMES",e[e.NOEMBED=77]="NOEMBED",e[e.NOSCRIPT=78]="NOSCRIPT",e[e.OBJECT=79]="OBJECT",e[e.OL=80]="OL",e[e.OPTGROUP=81]="OPTGROUP",e[e.OPTION=82]="OPTION",e[e.P=83]="P",e[e.PARAM=84]="PARAM",e[e.PLAINTEXT=85]="PLAINTEXT",e[e.PRE=86]="PRE",e[e.RB=87]="RB",e[e.RP=88]="RP",e[e.RT=89]="RT",e[e.RTC=90]="RTC",e[e.RUBY=91]="RUBY",e[e.S=92]="S",e[e.SCRIPT=93]="SCRIPT",e[e.SECTION=94]="SECTION",e[e.SELECT=95]="SELECT",e[e.SOURCE=96]="SOURCE",e[e.SMALL=97]="SMALL",e[e.SPAN=98]="SPAN",e[e.STRIKE=99]="STRIKE",e[e.STRONG=100]="STRONG",e[e.STYLE=101]="STYLE",e[e.SUB=102]="SUB",e[e.SUMMARY=103]="SUMMARY",e[e.SUP=104]="SUP",e[e.TABLE=105]="TABLE",e[e.TBODY=106]="TBODY",e[e.TEMPLATE=107]="TEMPLATE",e[e.TEXTAREA=108]="TEXTAREA",e[e.TFOOT=109]="TFOOT",e[e.TD=110]="TD",e[e.TH=111]="TH",e[e.THEAD=112]="THEAD",e[e.TITLE=113]="TITLE",e[e.TR=114]="TR",e[e.TRACK=115]="TRACK",e[e.TT=116]="TT",e[e.U=117]="U",e[e.UL=118]="UL",e[e.SVG=119]="SVG",e[e.VAR=120]="VAR",e[e.WBR=121]="WBR",e[e.XMP=122]="XMP";}(S=S||(S={}));const R=new Map([[C.A,S.A],[C.ADDRESS,S.ADDRESS],[C.ANNOTATION_XML,S.ANNOTATION_XML],[C.APPLET,S.APPLET],[C.AREA,S.AREA],[C.ARTICLE,S.ARTICLE],[C.ASIDE,S.ASIDE],[C.B,S.B],[C.BASE,S.BASE],[C.BASEFONT,S.BASEFONT],[C.BGSOUND,S.BGSOUND],[C.BIG,S.BIG],[C.BLOCKQUOTE,S.BLOCKQUOTE],[C.BODY,S.BODY],[C.BR,S.BR],[C.BUTTON,S.BUTTON],[C.CAPTION,S.CAPTION],[C.CENTER,S.CENTER],[C.CODE,S.CODE],[C.COL,S.COL],[C.COLGROUP,S.COLGROUP],[C.DD,S.DD],[C.DESC,S.DESC],[C.DETAILS,S.DETAILS],[C.DIALOG,S.DIALOG],[C.DIR,S.DIR],[C.DIV,S.DIV],[C.DL,S.DL],[C.DT,S.DT],[C.EM,S.EM],[C.EMBED,S.EMBED],[C.FIELDSET,S.FIELDSET],[C.FIGCAPTION,S.FIGCAPTION],[C.FIGURE,S.FIGURE],[C.FONT,S.FONT],[C.FOOTER,S.FOOTER],[C.FOREIGN_OBJECT,S.FOREIGN_OBJECT],[C.FORM,S.FORM],[C.FRAME,S.FRAME],[C.FRAMESET,S.FRAMESET],[C.H1,S.H1],[C.H2,S.H2],[C.H3,S.H3],[C.H4,S.H4],[C.H5,S.H5],[C.H6,S.H6],[C.HEAD,S.HEAD],[C.HEADER,S.HEADER],[C.HGROUP,S.HGROUP],[C.HR,S.HR],[C.HTML,S.HTML],[C.I,S.I],[C.IMG,S.IMG],[C.IMAGE,S.IMAGE],[C.INPUT,S.INPUT],[C.IFRAME,S.IFRAME],[C.KEYGEN,S.KEYGEN],[C.LABEL,S.LABEL],[C.LI,S.LI],[C.LINK,S.LINK],[C.LISTING,S.LISTING],[C.MAIN,S.MAIN],[C.MALIGNMARK,S.MALIGNMARK],[C.MARQUEE,S.MARQUEE],[C.MATH,S.MATH],[C.MENU,S.MENU],[C.META,S.META],[C.MGLYPH,S.MGLYPH],[C.MI,S.MI],[C.MO,S.MO],[C.MN,S.MN],[C.MS,S.MS],[C.MTEXT,S.MTEXT],[C.NAV,S.NAV],[C.NOBR,S.NOBR],[C.NOFRAMES,S.NOFRAMES],[C.NOEMBED,S.NOEMBED],[C.NOSCRIPT,S.NOSCRIPT],[C.OBJECT,S.OBJECT],[C.OL,S.OL],[C.OPTGROUP,S.OPTGROUP],[C.OPTION,S.OPTION],[C.P,S.P],[C.PARAM,S.PARAM],[C.PLAINTEXT,S.PLAINTEXT],[C.PRE,S.PRE],[C.RB,S.RB],[C.RP,S.RP],[C.RT,S.RT],[C.RTC,S.RTC],[C.RUBY,S.RUBY],[C.S,S.S],[C.SCRIPT,S.SCRIPT],[C.SECTION,S.SECTION],[C.SELECT,S.SELECT],[C.SOURCE,S.SOURCE],[C.SMALL,S.SMALL],[C.SPAN,S.SPAN],[C.STRIKE,S.STRIKE],[C.STRONG,S.STRONG],[C.STYLE,S.STYLE],[C.SUB,S.SUB],[C.SUMMARY,S.SUMMARY],[C.SUP,S.SUP],[C.TABLE,S.TABLE],[C.TBODY,S.TBODY],[C.TEMPLATE,S.TEMPLATE],[C.TEXTAREA,S.TEXTAREA],[C.TFOOT,S.TFOOT],[C.TD,S.TD],[C.TH,S.TH],[C.THEAD,S.THEAD],[C.TITLE,S.TITLE],[C.TR,S.TR],[C.TRACK,S.TRACK],[C.TT,S.TT],[C.U,S.U],[C.UL,S.UL],[C.SVG,S.SVG],[C.VAR,S.VAR],[C.WBR,S.WBR],[C.XMP,S.XMP]]);function O(e){var t;return null!==(t=R.get(e))&&void 0!==t?t:S.UNKNOWN}const f=S,L={[u.HTML]:new Set([f.ADDRESS,f.APPLET,f.AREA,f.ARTICLE,f.ASIDE,f.BASE,f.BASEFONT,f.BGSOUND,f.BLOCKQUOTE,f.BODY,f.BR,f.BUTTON,f.CAPTION,f.CENTER,f.COL,f.COLGROUP,f.DD,f.DETAILS,f.DIR,f.DIV,f.DL,f.DT,f.EMBED,f.FIELDSET,f.FIGCAPTION,f.FIGURE,f.FOOTER,f.FORM,f.FRAME,f.FRAMESET,f.H1,f.H2,f.H3,f.H4,f.H5,f.H6,f.HEAD,f.HEADER,f.HGROUP,f.HR,f.HTML,f.IFRAME,f.IMG,f.INPUT,f.LI,f.LINK,f.LISTING,f.MAIN,f.MARQUEE,f.MENU,f.META,f.NAV,f.NOEMBED,f.NOFRAMES,f.NOSCRIPT,f.OBJECT,f.OL,f.P,f.PARAM,f.PLAINTEXT,f.PRE,f.SCRIPT,f.SECTION,f.SELECT,f.SOURCE,f.STYLE,f.SUMMARY,f.TABLE,f.TBODY,f.TD,f.TEMPLATE,f.TEXTAREA,f.TFOOT,f.TH,f.THEAD,f.TITLE,f.TR,f.TRACK,f.UL,f.WBR,f.XMP]),[u.MATHML]:new Set([f.MI,f.MO,f.MN,f.MS,f.MTEXT,f.ANNOTATION_XML]),[u.SVG]:new Set([f.TITLE,f.FOREIGN_OBJECT,f.DESC]),[u.XLINK]:new Set,[u.XML]:new Set,[u.XMLNS]:new Set};function M(e){return e===f.H1||e===f.H2||e===f.H3||e===f.H4||e===f.H5||e===f.H6}new Set([C.STYLE,C.SCRIPT,C.XMP,C.IFRAME,C.NOEMBED,C.NOFRAMES,C.PLAINTEXT]);const g=new Map([[128,8364],[130,8218],[131,402],[132,8222],[133,8230],[134,8224],[135,8225],[136,710],[137,8240],[138,352],[139,8249],[140,338],[142,381],[145,8216],[146,8217],[147,8220],[148,8221],[149,8226],[150,8211],[151,8212],[152,732],[153,8482],[154,353],[155,8250],[156,339],[158,382],[159,376]]);var P;!function(e){e[e.DATA=0]="DATA",e[e.RCDATA=1]="RCDATA",e[e.RAWTEXT=2]="RAWTEXT",e[e.SCRIPT_DATA=3]="SCRIPT_DATA",e[e.PLAINTEXT=4]="PLAINTEXT",e[e.TAG_OPEN=5]="TAG_OPEN",e[e.END_TAG_OPEN=6]="END_TAG_OPEN",e[e.TAG_NAME=7]="TAG_NAME",e[e.RCDATA_LESS_THAN_SIGN=8]="RCDATA_LESS_THAN_SIGN",e[e.RCDATA_END_TAG_OPEN=9]="RCDATA_END_TAG_OPEN",e[e.RCDATA_END_TAG_NAME=10]="RCDATA_END_TAG_NAME",e[e.RAWTEXT_LESS_THAN_SIGN=11]="RAWTEXT_LESS_THAN_SIGN",e[e.RAWTEXT_END_TAG_OPEN=12]="RAWTEXT_END_TAG_OPEN",e[e.RAWTEXT_END_TAG_NAME=13]="RAWTEXT_END_TAG_NAME",e[e.SCRIPT_DATA_LESS_THAN_SIGN=14]="SCRIPT_DATA_LESS_THAN_SIGN",e[e.SCRIPT_DATA_END_TAG_OPEN=15]="SCRIPT_DATA_END_TAG_OPEN",e[e.SCRIPT_DATA_END_TAG_NAME=16]="SCRIPT_DATA_END_TAG_NAME",e[e.SCRIPT_DATA_ESCAPE_START=17]="SCRIPT_DATA_ESCAPE_START",e[e.SCRIPT_DATA_ESCAPE_START_DASH=18]="SCRIPT_DATA_ESCAPE_START_DASH",e[e.SCRIPT_DATA_ESCAPED=19]="SCRIPT_DATA_ESCAPED",e[e.SCRIPT_DATA_ESCAPED_DASH=20]="SCRIPT_DATA_ESCAPED_DASH",e[e.SCRIPT_DATA_ESCAPED_DASH_DASH=21]="SCRIPT_DATA_ESCAPED_DASH_DASH",e[e.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN=22]="SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN",e[e.SCRIPT_DATA_ESCAPED_END_TAG_OPEN=23]="SCRIPT_DATA_ESCAPED_END_TAG_OPEN",e[e.SCRIPT_DATA_ESCAPED_END_TAG_NAME=24]="SCRIPT_DATA_ESCAPED_END_TAG_NAME",e[e.SCRIPT_DATA_DOUBLE_ESCAPE_START=25]="SCRIPT_DATA_DOUBLE_ESCAPE_START",e[e.SCRIPT_DATA_DOUBLE_ESCAPED=26]="SCRIPT_DATA_DOUBLE_ESCAPED",e[e.SCRIPT_DATA_DOUBLE_ESCAPED_DASH=27]="SCRIPT_DATA_DOUBLE_ESCAPED_DASH",e[e.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH=28]="SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH",e[e.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN=29]="SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN",e[e.SCRIPT_DATA_DOUBLE_ESCAPE_END=30]="SCRIPT_DATA_DOUBLE_ESCAPE_END",e[e.BEFORE_ATTRIBUTE_NAME=31]="BEFORE_ATTRIBUTE_NAME",e[e.ATTRIBUTE_NAME=32]="ATTRIBUTE_NAME",e[e.AFTER_ATTRIBUTE_NAME=33]="AFTER_ATTRIBUTE_NAME",e[e.BEFORE_ATTRIBUTE_VALUE=34]="BEFORE_ATTRIBUTE_VALUE",e[e.ATTRIBUTE_VALUE_DOUBLE_QUOTED=35]="ATTRIBUTE_VALUE_DOUBLE_QUOTED",e[e.ATTRIBUTE_VALUE_SINGLE_QUOTED=36]="ATTRIBUTE_VALUE_SINGLE_QUOTED",e[e.ATTRIBUTE_VALUE_UNQUOTED=37]="ATTRIBUTE_VALUE_UNQUOTED",e[e.AFTER_ATTRIBUTE_VALUE_QUOTED=38]="AFTER_ATTRIBUTE_VALUE_QUOTED",e[e.SELF_CLOSING_START_TAG=39]="SELF_CLOSING_START_TAG",e[e.BOGUS_COMMENT=40]="BOGUS_COMMENT",e[e.MARKUP_DECLARATION_OPEN=41]="MARKUP_DECLARATION_OPEN",e[e.COMMENT_START=42]="COMMENT_START",e[e.COMMENT_START_DASH=43]="COMMENT_START_DASH",e[e.COMMENT=44]="COMMENT",e[e.COMMENT_LESS_THAN_SIGN=45]="COMMENT_LESS_THAN_SIGN",e[e.COMMENT_LESS_THAN_SIGN_BANG=46]="COMMENT_LESS_THAN_SIGN_BANG",e[e.COMMENT_LESS_THAN_SIGN_BANG_DASH=47]="COMMENT_LESS_THAN_SIGN_BANG_DASH",e[e.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH=48]="COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH",e[e.COMMENT_END_DASH=49]="COMMENT_END_DASH",e[e.COMMENT_END=50]="COMMENT_END",e[e.COMMENT_END_BANG=51]="COMMENT_END_BANG",e[e.DOCTYPE=52]="DOCTYPE",e[e.BEFORE_DOCTYPE_NAME=53]="BEFORE_DOCTYPE_NAME",e[e.DOCTYPE_NAME=54]="DOCTYPE_NAME",e[e.AFTER_DOCTYPE_NAME=55]="AFTER_DOCTYPE_NAME",e[e.AFTER_DOCTYPE_PUBLIC_KEYWORD=56]="AFTER_DOCTYPE_PUBLIC_KEYWORD",e[e.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER=57]="BEFORE_DOCTYPE_PUBLIC_IDENTIFIER",e[e.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED=58]="DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED",e[e.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED=59]="DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED",e[e.AFTER_DOCTYPE_PUBLIC_IDENTIFIER=60]="AFTER_DOCTYPE_PUBLIC_IDENTIFIER",e[e.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS=61]="BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS",e[e.AFTER_DOCTYPE_SYSTEM_KEYWORD=62]="AFTER_DOCTYPE_SYSTEM_KEYWORD",e[e.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER=63]="BEFORE_DOCTYPE_SYSTEM_IDENTIFIER",e[e.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED=64]="DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED",e[e.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED=65]="DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED",e[e.AFTER_DOCTYPE_SYSTEM_IDENTIFIER=66]="AFTER_DOCTYPE_SYSTEM_IDENTIFIER",e[e.BOGUS_DOCTYPE=67]="BOGUS_DOCTYPE",e[e.CDATA_SECTION=68]="CDATA_SECTION",e[e.CDATA_SECTION_BRACKET=69]="CDATA_SECTION_BRACKET",e[e.CDATA_SECTION_END=70]="CDATA_SECTION_END",e[e.CHARACTER_REFERENCE=71]="CHARACTER_REFERENCE",e[e.NAMED_CHARACTER_REFERENCE=72]="NAMED_CHARACTER_REFERENCE",e[e.AMBIGUOUS_AMPERSAND=73]="AMBIGUOUS_AMPERSAND",e[e.NUMERIC_CHARACTER_REFERENCE=74]="NUMERIC_CHARACTER_REFERENCE",e[e.HEXADEMICAL_CHARACTER_REFERENCE_START=75]="HEXADEMICAL_CHARACTER_REFERENCE_START",e[e.HEXADEMICAL_CHARACTER_REFERENCE=76]="HEXADEMICAL_CHARACTER_REFERENCE",e[e.DECIMAL_CHARACTER_REFERENCE=77]="DECIMAL_CHARACTER_REFERENCE",e[e.NUMERIC_CHARACTER_REFERENCE_END=78]="NUMERIC_CHARACTER_REFERENCE_END";}(P||(P={}));const k={DATA:P.DATA,RCDATA:P.RCDATA,RAWTEXT:P.RAWTEXT,SCRIPT_DATA:P.SCRIPT_DATA,PLAINTEXT:P.PLAINTEXT,CDATA_SECTION:P.CDATA_SECTION};function b(e){return e>=a.DIGIT_0&&e<=a.DIGIT_9}function B(e){return e>=a.LATIN_CAPITAL_A&&e<=a.LATIN_CAPITAL_Z}function H(e){return function(e){return e>=a.LATIN_SMALL_A&&e<=a.LATIN_SMALL_Z}(e)||B(e)}function F(e){return H(e)||b(e)}function U(e){return e>=a.LATIN_CAPITAL_A&&e<=a.LATIN_CAPITAL_F}function y(e){return e>=a.LATIN_SMALL_A&&e<=a.LATIN_SMALL_F}function G(e){return e+32}function w(e){return e===a.SPACE||e===a.LINE_FEED||e===a.TABULATION||e===a.FORM_FEED}function x(e){return w(e)||e===a.SOLIDUS||e===a.GREATER_THAN_SIGN}class Y{constructor(e,t){this.options=e,this.handler=t,this.paused=!1,this.inLoop=!1,this.inForeignNode=!1,this.lastStartTagName="",this.active=!1,this.state=P.DATA,this.returnState=P.DATA,this.charRefCode=-1,this.consumedAfterSnapshot=-1,this.currentCharacterToken=null,this.currentToken=null,this.currentAttr={name:"",value:""},this.preprocessor=new _(t),this.currentLocation=this.getCurrentLocation(-1);}_err(e){var t,s;null===(s=(t=this.handler).onParseError)||void 0===s||s.call(t,this.preprocessor.getError(e));}getCurrentLocation(e){return this.options.sourceCodeLocationInfo?{startLine:this.preprocessor.line,startCol:this.preprocessor.col-e,startOffset:this.preprocessor.offset-e,endLine:-1,endCol:-1,endOffset:-1}:null}_runParsingLoop(){if(!this.inLoop){for(this.inLoop=!0;this.active&&!this.paused;){this.consumedAfterSnapshot=0;const e=this._consume();this._ensureHibernation()||this._callState(e);}this.inLoop=!1;}}pause(){this.paused=!0;}resume(e){if(!this.paused)throw new Error("Parser was already resumed");this.paused=!1,this.inLoop||(this._runParsingLoop(),this.paused||null==e||e());}write(e,t,s){this.active=!0,this.preprocessor.write(e,t),this._runParsingLoop(),this.paused||null==s||s();}insertHtmlAtCurrentPos(e){this.active=!0,this.preprocessor.insertHtmlAtCurrentPos(e),this._runParsingLoop();}_ensureHibernation(){return !!this.preprocessor.endOfChunkHit&&(this._unconsume(this.consumedAfterSnapshot),this.active=!1,!0)}_consume(){return this.consumedAfterSnapshot++,this.preprocessor.advance()}_unconsume(e){this.consumedAfterSnapshot-=e,this.preprocessor.retreat(e);}_reconsumeInState(e,t){this.state=e,this._callState(t);}_advanceBy(e){this.consumedAfterSnapshot+=e;for(let t=0;t<e;t++)this.preprocessor.advance();}_consumeSequenceIfMatch(e,t){return !!this.preprocessor.startsWith(e,t)&&(this._advanceBy(e.length-1),!0)}_createStartTagToken(){this.currentToken={type:h.START_TAG,tagName:"",tagID:S.UNKNOWN,selfClosing:!1,ackSelfClosing:!1,attrs:[],location:this.getCurrentLocation(1)};}_createEndTagToken(){this.currentToken={type:h.END_TAG,tagName:"",tagID:S.UNKNOWN,selfClosing:!1,ackSelfClosing:!1,attrs:[],location:this.getCurrentLocation(2)};}_createCommentToken(e){this.currentToken={type:h.COMMENT,data:"",location:this.getCurrentLocation(e)};}_createDoctypeToken(e){this.currentToken={type:h.DOCTYPE,name:e,forceQuirks:!1,publicId:null,systemId:null,location:this.currentLocation};}_createCharacterToken(e,t){this.currentCharacterToken={type:e,chars:t,location:this.currentLocation};}_createAttr(e){this.currentAttr={name:e,value:""},this.currentLocation=this.getCurrentLocation(0);}_leaveAttrName(){var e,t;const s=this.currentToken;null===A(s,this.currentAttr.name)?(s.attrs.push(this.currentAttr),s.location&&this.currentLocation&&((null!==(e=(t=s.location).attrs)&&void 0!==e?e:t.attrs=Object.create(null))[this.currentAttr.name]=this.currentLocation,this._leaveAttrValue())):this._err(T.duplicateAttribute);}_leaveAttrValue(){this.currentLocation&&(this.currentLocation.endLine=this.preprocessor.line,this.currentLocation.endCol=this.preprocessor.col,this.currentLocation.endOffset=this.preprocessor.offset);}prepareToken(e){this._emitCurrentCharacterToken(e.location),this.currentToken=null,e.location&&(e.location.endLine=this.preprocessor.line,e.location.endCol=this.preprocessor.col+1,e.location.endOffset=this.preprocessor.offset+1),this.currentLocation=this.getCurrentLocation(-1);}emitCurrentTagToken(){const e=this.currentToken;this.prepareToken(e),e.tagID=O(e.tagName),e.type===h.START_TAG?(this.lastStartTagName=e.tagName,this.handler.onStartTag(e)):(e.attrs.length>0&&this._err(T.endTagWithAttributes),e.selfClosing&&this._err(T.endTagWithTrailingSolidus),this.handler.onEndTag(e)),this.preprocessor.dropParsedChunk();}emitCurrentComment(e){this.prepareToken(e),this.handler.onComment(e),this.preprocessor.dropParsedChunk();}emitCurrentDoctype(e){this.prepareToken(e),this.handler.onDoctype(e),this.preprocessor.dropParsedChunk();}_emitCurrentCharacterToken(e){if(this.currentCharacterToken){switch(e&&this.currentCharacterToken.location&&(this.currentCharacterToken.location.endLine=e.startLine,this.currentCharacterToken.location.endCol=e.startCol,this.currentCharacterToken.location.endOffset=e.startOffset),this.currentCharacterToken.type){case h.CHARACTER:this.handler.onCharacter(this.currentCharacterToken);break;case h.NULL_CHARACTER:this.handler.onNullCharacter(this.currentCharacterToken);break;case h.WHITESPACE_CHARACTER:this.handler.onWhitespaceCharacter(this.currentCharacterToken);}this.currentCharacterToken=null;}}_emitEOFToken(){const e=this.getCurrentLocation(0);e&&(e.endLine=e.startLine,e.endCol=e.startCol,e.endOffset=e.startOffset),this._emitCurrentCharacterToken(e),this.handler.onEof({type:h.EOF,location:e}),this.active=!1;}_appendCharToCurrentCharacterToken(e,t){if(this.currentCharacterToken){if(this.currentCharacterToken.type===e)return void(this.currentCharacterToken.chars+=t);this.currentLocation=this.getCurrentLocation(0),this._emitCurrentCharacterToken(this.currentLocation),this.preprocessor.dropParsedChunk();}this._createCharacterToken(e,t);}_emitCodePoint(e){const t=w(e)?h.WHITESPACE_CHARACTER:e===a.NULL?h.NULL_CHARACTER:h.CHARACTER;this._appendCharToCurrentCharacterToken(t,String.fromCodePoint(e));}_emitChars(e){this._appendCharToCurrentCharacterToken(h.CHARACTER,e);}_matchNamedCharacterReference(e){let t=null,s=0,r=!1;for(let i=0,o=m.htmlDecodeTree[0];i>=0&&(i=m.determineBranch(m.htmlDecodeTree,o,i+1,e),!(i<0));e=this._consume()){s+=1,o=m.htmlDecodeTree[i];const c=o&m.BinTrieFlags.VALUE_LENGTH;if(c){const o=(c>>14)-1;if(e!==a.SEMICOLON&&this._isCharacterReferenceInAttribute()&&((n=this.preprocessor.peek(1))===a.EQUALS_SIGN||F(n))?(t=[a.AMPERSAND],i+=o):(t=0===o?[m.htmlDecodeTree[i]&~m.BinTrieFlags.VALUE_LENGTH]:1===o?[m.htmlDecodeTree[++i]]:[m.htmlDecodeTree[++i],m.htmlDecodeTree[++i]],s=0,r=e!==a.SEMICOLON),0===o){this._consume();break}}}var n;return this._unconsume(s),r&&!this.preprocessor.endOfChunkHit&&this._err(T.missingSemicolonAfterCharacterReference),this._unconsume(1),t}_isCharacterReferenceInAttribute(){return this.returnState===P.ATTRIBUTE_VALUE_DOUBLE_QUOTED||this.returnState===P.ATTRIBUTE_VALUE_SINGLE_QUOTED||this.returnState===P.ATTRIBUTE_VALUE_UNQUOTED}_flushCodePointConsumedAsCharacterReference(e){this._isCharacterReferenceInAttribute()?this.currentAttr.value+=String.fromCodePoint(e):this._emitCodePoint(e);}_callState(e){switch(this.state){case P.DATA:this._stateData(e);break;case P.RCDATA:this._stateRcdata(e);break;case P.RAWTEXT:this._stateRawtext(e);break;case P.SCRIPT_DATA:this._stateScriptData(e);break;case P.PLAINTEXT:this._statePlaintext(e);break;case P.TAG_OPEN:this._stateTagOpen(e);break;case P.END_TAG_OPEN:this._stateEndTagOpen(e);break;case P.TAG_NAME:this._stateTagName(e);break;case P.RCDATA_LESS_THAN_SIGN:this._stateRcdataLessThanSign(e);break;case P.RCDATA_END_TAG_OPEN:this._stateRcdataEndTagOpen(e);break;case P.RCDATA_END_TAG_NAME:this._stateRcdataEndTagName(e);break;case P.RAWTEXT_LESS_THAN_SIGN:this._stateRawtextLessThanSign(e);break;case P.RAWTEXT_END_TAG_OPEN:this._stateRawtextEndTagOpen(e);break;case P.RAWTEXT_END_TAG_NAME:this._stateRawtextEndTagName(e);break;case P.SCRIPT_DATA_LESS_THAN_SIGN:this._stateScriptDataLessThanSign(e);break;case P.SCRIPT_DATA_END_TAG_OPEN:this._stateScriptDataEndTagOpen(e);break;case P.SCRIPT_DATA_END_TAG_NAME:this._stateScriptDataEndTagName(e);break;case P.SCRIPT_DATA_ESCAPE_START:this._stateScriptDataEscapeStart(e);break;case P.SCRIPT_DATA_ESCAPE_START_DASH:this._stateScriptDataEscapeStartDash(e);break;case P.SCRIPT_DATA_ESCAPED:this._stateScriptDataEscaped(e);break;case P.SCRIPT_DATA_ESCAPED_DASH:this._stateScriptDataEscapedDash(e);break;case P.SCRIPT_DATA_ESCAPED_DASH_DASH:this._stateScriptDataEscapedDashDash(e);break;case P.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN:this._stateScriptDataEscapedLessThanSign(e);break;case P.SCRIPT_DATA_ESCAPED_END_TAG_OPEN:this._stateScriptDataEscapedEndTagOpen(e);break;case P.SCRIPT_DATA_ESCAPED_END_TAG_NAME:this._stateScriptDataEscapedEndTagName(e);break;case P.SCRIPT_DATA_DOUBLE_ESCAPE_START:this._stateScriptDataDoubleEscapeStart(e);break;case P.SCRIPT_DATA_DOUBLE_ESCAPED:this._stateScriptDataDoubleEscaped(e);break;case P.SCRIPT_DATA_DOUBLE_ESCAPED_DASH:this._stateScriptDataDoubleEscapedDash(e);break;case P.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH:this._stateScriptDataDoubleEscapedDashDash(e);break;case P.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN:this._stateScriptDataDoubleEscapedLessThanSign(e);break;case P.SCRIPT_DATA_DOUBLE_ESCAPE_END:this._stateScriptDataDoubleEscapeEnd(e);break;case P.BEFORE_ATTRIBUTE_NAME:this._stateBeforeAttributeName(e);break;case P.ATTRIBUTE_NAME:this._stateAttributeName(e);break;case P.AFTER_ATTRIBUTE_NAME:this._stateAfterAttributeName(e);break;case P.BEFORE_ATTRIBUTE_VALUE:this._stateBeforeAttributeValue(e);break;case P.ATTRIBUTE_VALUE_DOUBLE_QUOTED:this._stateAttributeValueDoubleQuoted(e);break;case P.ATTRIBUTE_VALUE_SINGLE_QUOTED:this._stateAttributeValueSingleQuoted(e);break;case P.ATTRIBUTE_VALUE_UNQUOTED:this._stateAttributeValueUnquoted(e);break;case P.AFTER_ATTRIBUTE_VALUE_QUOTED:this._stateAfterAttributeValueQuoted(e);break;case P.SELF_CLOSING_START_TAG:this._stateSelfClosingStartTag(e);break;case P.BOGUS_COMMENT:this._stateBogusComment(e);break;case P.MARKUP_DECLARATION_OPEN:this._stateMarkupDeclarationOpen(e);break;case P.COMMENT_START:this._stateCommentStart(e);break;case P.COMMENT_START_DASH:this._stateCommentStartDash(e);break;case P.COMMENT:this._stateComment(e);break;case P.COMMENT_LESS_THAN_SIGN:this._stateCommentLessThanSign(e);break;case P.COMMENT_LESS_THAN_SIGN_BANG:this._stateCommentLessThanSignBang(e);break;case P.COMMENT_LESS_THAN_SIGN_BANG_DASH:this._stateCommentLessThanSignBangDash(e);break;case P.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH:this._stateCommentLessThanSignBangDashDash(e);break;case P.COMMENT_END_DASH:this._stateCommentEndDash(e);break;case P.COMMENT_END:this._stateCommentEnd(e);break;case P.COMMENT_END_BANG:this._stateCommentEndBang(e);break;case P.DOCTYPE:this._stateDoctype(e);break;case P.BEFORE_DOCTYPE_NAME:this._stateBeforeDoctypeName(e);break;case P.DOCTYPE_NAME:this._stateDoctypeName(e);break;case P.AFTER_DOCTYPE_NAME:this._stateAfterDoctypeName(e);break;case P.AFTER_DOCTYPE_PUBLIC_KEYWORD:this._stateAfterDoctypePublicKeyword(e);break;case P.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER:this._stateBeforeDoctypePublicIdentifier(e);break;case P.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED:this._stateDoctypePublicIdentifierDoubleQuoted(e);break;case P.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED:this._stateDoctypePublicIdentifierSingleQuoted(e);break;case P.AFTER_DOCTYPE_PUBLIC_IDENTIFIER:this._stateAfterDoctypePublicIdentifier(e);break;case P.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS:this._stateBetweenDoctypePublicAndSystemIdentifiers(e);break;case P.AFTER_DOCTYPE_SYSTEM_KEYWORD:this._stateAfterDoctypeSystemKeyword(e);break;case P.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER:this._stateBeforeDoctypeSystemIdentifier(e);break;case P.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED:this._stateDoctypeSystemIdentifierDoubleQuoted(e);break;case P.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED:this._stateDoctypeSystemIdentifierSingleQuoted(e);break;case P.AFTER_DOCTYPE_SYSTEM_IDENTIFIER:this._stateAfterDoctypeSystemIdentifier(e);break;case P.BOGUS_DOCTYPE:this._stateBogusDoctype(e);break;case P.CDATA_SECTION:this._stateCdataSection(e);break;case P.CDATA_SECTION_BRACKET:this._stateCdataSectionBracket(e);break;case P.CDATA_SECTION_END:this._stateCdataSectionEnd(e);break;case P.CHARACTER_REFERENCE:this._stateCharacterReference(e);break;case P.NAMED_CHARACTER_REFERENCE:this._stateNamedCharacterReference(e);break;case P.AMBIGUOUS_AMPERSAND:this._stateAmbiguousAmpersand(e);break;case P.NUMERIC_CHARACTER_REFERENCE:this._stateNumericCharacterReference(e);break;case P.HEXADEMICAL_CHARACTER_REFERENCE_START:this._stateHexademicalCharacterReferenceStart(e);break;case P.HEXADEMICAL_CHARACTER_REFERENCE:this._stateHexademicalCharacterReference(e);break;case P.DECIMAL_CHARACTER_REFERENCE:this._stateDecimalCharacterReference(e);break;case P.NUMERIC_CHARACTER_REFERENCE_END:this._stateNumericCharacterReferenceEnd(e);break;default:throw new Error("Unknown state")}}_stateData(e){switch(e){case a.LESS_THAN_SIGN:this.state=P.TAG_OPEN;break;case a.AMPERSAND:this.returnState=P.DATA,this.state=P.CHARACTER_REFERENCE;break;case a.NULL:this._err(T.unexpectedNullCharacter),this._emitCodePoint(e);break;case a.EOF:this._emitEOFToken();break;default:this._emitCodePoint(e);}}_stateRcdata(e){switch(e){case a.AMPERSAND:this.returnState=P.RCDATA,this.state=P.CHARACTER_REFERENCE;break;case a.LESS_THAN_SIGN:this.state=P.RCDATA_LESS_THAN_SIGN;break;case a.NULL:this._err(T.unexpectedNullCharacter),this._emitChars(s);break;case a.EOF:this._emitEOFToken();break;default:this._emitCodePoint(e);}}_stateRawtext(e){switch(e){case a.LESS_THAN_SIGN:this.state=P.RAWTEXT_LESS_THAN_SIGN;break;case a.NULL:this._err(T.unexpectedNullCharacter),this._emitChars(s);break;case a.EOF:this._emitEOFToken();break;default:this._emitCodePoint(e);}}_stateScriptData(e){switch(e){case a.LESS_THAN_SIGN:this.state=P.SCRIPT_DATA_LESS_THAN_SIGN;break;case a.NULL:this._err(T.unexpectedNullCharacter),this._emitChars(s);break;case a.EOF:this._emitEOFToken();break;default:this._emitCodePoint(e);}}_statePlaintext(e){switch(e){case a.NULL:this._err(T.unexpectedNullCharacter),this._emitChars(s);break;case a.EOF:this._emitEOFToken();break;default:this._emitCodePoint(e);}}_stateTagOpen(e){if(H(e))this._createStartTagToken(),this.state=P.TAG_NAME,this._stateTagName(e);else switch(e){case a.EXCLAMATION_MARK:this.state=P.MARKUP_DECLARATION_OPEN;break;case a.SOLIDUS:this.state=P.END_TAG_OPEN;break;case a.QUESTION_MARK:this._err(T.unexpectedQuestionMarkInsteadOfTagName),this._createCommentToken(1),this.state=P.BOGUS_COMMENT,this._stateBogusComment(e);break;case a.EOF:this._err(T.eofBeforeTagName),this._emitChars("<"),this._emitEOFToken();break;default:this._err(T.invalidFirstCharacterOfTagName),this._emitChars("<"),this.state=P.DATA,this._stateData(e);}}_stateEndTagOpen(e){if(H(e))this._createEndTagToken(),this.state=P.TAG_NAME,this._stateTagName(e);else switch(e){case a.GREATER_THAN_SIGN:this._err(T.missingEndTagName),this.state=P.DATA;break;case a.EOF:this._err(T.eofBeforeTagName),this._emitChars("</"),this._emitEOFToken();break;default:this._err(T.invalidFirstCharacterOfTagName),this._createCommentToken(2),this.state=P.BOGUS_COMMENT,this._stateBogusComment(e);}}_stateTagName(e){const t=this.currentToken;switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:this.state=P.BEFORE_ATTRIBUTE_NAME;break;case a.SOLIDUS:this.state=P.SELF_CLOSING_START_TAG;break;case a.GREATER_THAN_SIGN:this.state=P.DATA,this.emitCurrentTagToken();break;case a.NULL:this._err(T.unexpectedNullCharacter),t.tagName+=s;break;case a.EOF:this._err(T.eofInTag),this._emitEOFToken();break;default:t.tagName+=String.fromCodePoint(B(e)?G(e):e);}}_stateRcdataLessThanSign(e){e===a.SOLIDUS?this.state=P.RCDATA_END_TAG_OPEN:(this._emitChars("<"),this.state=P.RCDATA,this._stateRcdata(e));}_stateRcdataEndTagOpen(e){H(e)?(this.state=P.RCDATA_END_TAG_NAME,this._stateRcdataEndTagName(e)):(this._emitChars("</"),this.state=P.RCDATA,this._stateRcdata(e));}handleSpecialEndTag(e){if(!this.preprocessor.startsWith(this.lastStartTagName,!1))return !this._ensureHibernation();switch(this._createEndTagToken(),this.currentToken.tagName=this.lastStartTagName,this.preprocessor.peek(this.lastStartTagName.length)){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:return this._advanceBy(this.lastStartTagName.length),this.state=P.BEFORE_ATTRIBUTE_NAME,!1;case a.SOLIDUS:return this._advanceBy(this.lastStartTagName.length),this.state=P.SELF_CLOSING_START_TAG,!1;case a.GREATER_THAN_SIGN:return this._advanceBy(this.lastStartTagName.length),this.emitCurrentTagToken(),this.state=P.DATA,!1;default:return !this._ensureHibernation()}}_stateRcdataEndTagName(e){this.handleSpecialEndTag(e)&&(this._emitChars("</"),this.state=P.RCDATA,this._stateRcdata(e));}_stateRawtextLessThanSign(e){e===a.SOLIDUS?this.state=P.RAWTEXT_END_TAG_OPEN:(this._emitChars("<"),this.state=P.RAWTEXT,this._stateRawtext(e));}_stateRawtextEndTagOpen(e){H(e)?(this.state=P.RAWTEXT_END_TAG_NAME,this._stateRawtextEndTagName(e)):(this._emitChars("</"),this.state=P.RAWTEXT,this._stateRawtext(e));}_stateRawtextEndTagName(e){this.handleSpecialEndTag(e)&&(this._emitChars("</"),this.state=P.RAWTEXT,this._stateRawtext(e));}_stateScriptDataLessThanSign(e){switch(e){case a.SOLIDUS:this.state=P.SCRIPT_DATA_END_TAG_OPEN;break;case a.EXCLAMATION_MARK:this.state=P.SCRIPT_DATA_ESCAPE_START,this._emitChars("<!");break;default:this._emitChars("<"),this.state=P.SCRIPT_DATA,this._stateScriptData(e);}}_stateScriptDataEndTagOpen(e){H(e)?(this.state=P.SCRIPT_DATA_END_TAG_NAME,this._stateScriptDataEndTagName(e)):(this._emitChars("</"),this.state=P.SCRIPT_DATA,this._stateScriptData(e));}_stateScriptDataEndTagName(e){this.handleSpecialEndTag(e)&&(this._emitChars("</"),this.state=P.SCRIPT_DATA,this._stateScriptData(e));}_stateScriptDataEscapeStart(e){e===a.HYPHEN_MINUS?(this.state=P.SCRIPT_DATA_ESCAPE_START_DASH,this._emitChars("-")):(this.state=P.SCRIPT_DATA,this._stateScriptData(e));}_stateScriptDataEscapeStartDash(e){e===a.HYPHEN_MINUS?(this.state=P.SCRIPT_DATA_ESCAPED_DASH_DASH,this._emitChars("-")):(this.state=P.SCRIPT_DATA,this._stateScriptData(e));}_stateScriptDataEscaped(e){switch(e){case a.HYPHEN_MINUS:this.state=P.SCRIPT_DATA_ESCAPED_DASH,this._emitChars("-");break;case a.LESS_THAN_SIGN:this.state=P.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;break;case a.NULL:this._err(T.unexpectedNullCharacter),this._emitChars(s);break;case a.EOF:this._err(T.eofInScriptHtmlCommentLikeText),this._emitEOFToken();break;default:this._emitCodePoint(e);}}_stateScriptDataEscapedDash(e){switch(e){case a.HYPHEN_MINUS:this.state=P.SCRIPT_DATA_ESCAPED_DASH_DASH,this._emitChars("-");break;case a.LESS_THAN_SIGN:this.state=P.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;break;case a.NULL:this._err(T.unexpectedNullCharacter),this.state=P.SCRIPT_DATA_ESCAPED,this._emitChars(s);break;case a.EOF:this._err(T.eofInScriptHtmlCommentLikeText),this._emitEOFToken();break;default:this.state=P.SCRIPT_DATA_ESCAPED,this._emitCodePoint(e);}}_stateScriptDataEscapedDashDash(e){switch(e){case a.HYPHEN_MINUS:this._emitChars("-");break;case a.LESS_THAN_SIGN:this.state=P.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;break;case a.GREATER_THAN_SIGN:this.state=P.SCRIPT_DATA,this._emitChars(">");break;case a.NULL:this._err(T.unexpectedNullCharacter),this.state=P.SCRIPT_DATA_ESCAPED,this._emitChars(s);break;case a.EOF:this._err(T.eofInScriptHtmlCommentLikeText),this._emitEOFToken();break;default:this.state=P.SCRIPT_DATA_ESCAPED,this._emitCodePoint(e);}}_stateScriptDataEscapedLessThanSign(e){e===a.SOLIDUS?this.state=P.SCRIPT_DATA_ESCAPED_END_TAG_OPEN:H(e)?(this._emitChars("<"),this.state=P.SCRIPT_DATA_DOUBLE_ESCAPE_START,this._stateScriptDataDoubleEscapeStart(e)):(this._emitChars("<"),this.state=P.SCRIPT_DATA_ESCAPED,this._stateScriptDataEscaped(e));}_stateScriptDataEscapedEndTagOpen(e){H(e)?(this.state=P.SCRIPT_DATA_ESCAPED_END_TAG_NAME,this._stateScriptDataEscapedEndTagName(e)):(this._emitChars("</"),this.state=P.SCRIPT_DATA_ESCAPED,this._stateScriptDataEscaped(e));}_stateScriptDataEscapedEndTagName(e){this.handleSpecialEndTag(e)&&(this._emitChars("</"),this.state=P.SCRIPT_DATA_ESCAPED,this._stateScriptDataEscaped(e));}_stateScriptDataDoubleEscapeStart(e){if(this.preprocessor.startsWith(i,!1)&&x(this.preprocessor.peek(6))){this._emitCodePoint(e);for(let e=0;e<6;e++)this._emitCodePoint(this._consume());this.state=P.SCRIPT_DATA_DOUBLE_ESCAPED;}else this._ensureHibernation()||(this.state=P.SCRIPT_DATA_ESCAPED,this._stateScriptDataEscaped(e));}_stateScriptDataDoubleEscaped(e){switch(e){case a.HYPHEN_MINUS:this.state=P.SCRIPT_DATA_DOUBLE_ESCAPED_DASH,this._emitChars("-");break;case a.LESS_THAN_SIGN:this.state=P.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN,this._emitChars("<");break;case a.NULL:this._err(T.unexpectedNullCharacter),this._emitChars(s);break;case a.EOF:this._err(T.eofInScriptHtmlCommentLikeText),this._emitEOFToken();break;default:this._emitCodePoint(e);}}_stateScriptDataDoubleEscapedDash(e){switch(e){case a.HYPHEN_MINUS:this.state=P.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH,this._emitChars("-");break;case a.LESS_THAN_SIGN:this.state=P.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN,this._emitChars("<");break;case a.NULL:this._err(T.unexpectedNullCharacter),this.state=P.SCRIPT_DATA_DOUBLE_ESCAPED,this._emitChars(s);break;case a.EOF:this._err(T.eofInScriptHtmlCommentLikeText),this._emitEOFToken();break;default:this.state=P.SCRIPT_DATA_DOUBLE_ESCAPED,this._emitCodePoint(e);}}_stateScriptDataDoubleEscapedDashDash(e){switch(e){case a.HYPHEN_MINUS:this._emitChars("-");break;case a.LESS_THAN_SIGN:this.state=P.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN,this._emitChars("<");break;case a.GREATER_THAN_SIGN:this.state=P.SCRIPT_DATA,this._emitChars(">");break;case a.NULL:this._err(T.unexpectedNullCharacter),this.state=P.SCRIPT_DATA_DOUBLE_ESCAPED,this._emitChars(s);break;case a.EOF:this._err(T.eofInScriptHtmlCommentLikeText),this._emitEOFToken();break;default:this.state=P.SCRIPT_DATA_DOUBLE_ESCAPED,this._emitCodePoint(e);}}_stateScriptDataDoubleEscapedLessThanSign(e){e===a.SOLIDUS?(this.state=P.SCRIPT_DATA_DOUBLE_ESCAPE_END,this._emitChars("/")):(this.state=P.SCRIPT_DATA_DOUBLE_ESCAPED,this._stateScriptDataDoubleEscaped(e));}_stateScriptDataDoubleEscapeEnd(e){if(this.preprocessor.startsWith(i,!1)&&x(this.preprocessor.peek(6))){this._emitCodePoint(e);for(let e=0;e<6;e++)this._emitCodePoint(this._consume());this.state=P.SCRIPT_DATA_ESCAPED;}else this._ensureHibernation()||(this.state=P.SCRIPT_DATA_DOUBLE_ESCAPED,this._stateScriptDataDoubleEscaped(e));}_stateBeforeAttributeName(e){switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:break;case a.SOLIDUS:case a.GREATER_THAN_SIGN:case a.EOF:this.state=P.AFTER_ATTRIBUTE_NAME,this._stateAfterAttributeName(e);break;case a.EQUALS_SIGN:this._err(T.unexpectedEqualsSignBeforeAttributeName),this._createAttr("="),this.state=P.ATTRIBUTE_NAME;break;default:this._createAttr(""),this.state=P.ATTRIBUTE_NAME,this._stateAttributeName(e);}}_stateAttributeName(e){switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:case a.SOLIDUS:case a.GREATER_THAN_SIGN:case a.EOF:this._leaveAttrName(),this.state=P.AFTER_ATTRIBUTE_NAME,this._stateAfterAttributeName(e);break;case a.EQUALS_SIGN:this._leaveAttrName(),this.state=P.BEFORE_ATTRIBUTE_VALUE;break;case a.QUOTATION_MARK:case a.APOSTROPHE:case a.LESS_THAN_SIGN:this._err(T.unexpectedCharacterInAttributeName),this.currentAttr.name+=String.fromCodePoint(e);break;case a.NULL:this._err(T.unexpectedNullCharacter),this.currentAttr.name+=s;break;default:this.currentAttr.name+=String.fromCodePoint(B(e)?G(e):e);}}_stateAfterAttributeName(e){switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:break;case a.SOLIDUS:this.state=P.SELF_CLOSING_START_TAG;break;case a.EQUALS_SIGN:this.state=P.BEFORE_ATTRIBUTE_VALUE;break;case a.GREATER_THAN_SIGN:this.state=P.DATA,this.emitCurrentTagToken();break;case a.EOF:this._err(T.eofInTag),this._emitEOFToken();break;default:this._createAttr(""),this.state=P.ATTRIBUTE_NAME,this._stateAttributeName(e);}}_stateBeforeAttributeValue(e){switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:break;case a.QUOTATION_MARK:this.state=P.ATTRIBUTE_VALUE_DOUBLE_QUOTED;break;case a.APOSTROPHE:this.state=P.ATTRIBUTE_VALUE_SINGLE_QUOTED;break;case a.GREATER_THAN_SIGN:this._err(T.missingAttributeValue),this.state=P.DATA,this.emitCurrentTagToken();break;default:this.state=P.ATTRIBUTE_VALUE_UNQUOTED,this._stateAttributeValueUnquoted(e);}}_stateAttributeValueDoubleQuoted(e){switch(e){case a.QUOTATION_MARK:this.state=P.AFTER_ATTRIBUTE_VALUE_QUOTED;break;case a.AMPERSAND:this.returnState=P.ATTRIBUTE_VALUE_DOUBLE_QUOTED,this.state=P.CHARACTER_REFERENCE;break;case a.NULL:this._err(T.unexpectedNullCharacter),this.currentAttr.value+=s;break;case a.EOF:this._err(T.eofInTag),this._emitEOFToken();break;default:this.currentAttr.value+=String.fromCodePoint(e);}}_stateAttributeValueSingleQuoted(e){switch(e){case a.APOSTROPHE:this.state=P.AFTER_ATTRIBUTE_VALUE_QUOTED;break;case a.AMPERSAND:this.returnState=P.ATTRIBUTE_VALUE_SINGLE_QUOTED,this.state=P.CHARACTER_REFERENCE;break;case a.NULL:this._err(T.unexpectedNullCharacter),this.currentAttr.value+=s;break;case a.EOF:this._err(T.eofInTag),this._emitEOFToken();break;default:this.currentAttr.value+=String.fromCodePoint(e);}}_stateAttributeValueUnquoted(e){switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:this._leaveAttrValue(),this.state=P.BEFORE_ATTRIBUTE_NAME;break;case a.AMPERSAND:this.returnState=P.ATTRIBUTE_VALUE_UNQUOTED,this.state=P.CHARACTER_REFERENCE;break;case a.GREATER_THAN_SIGN:this._leaveAttrValue(),this.state=P.DATA,this.emitCurrentTagToken();break;case a.NULL:this._err(T.unexpectedNullCharacter),this.currentAttr.value+=s;break;case a.QUOTATION_MARK:case a.APOSTROPHE:case a.LESS_THAN_SIGN:case a.EQUALS_SIGN:case a.GRAVE_ACCENT:this._err(T.unexpectedCharacterInUnquotedAttributeValue),this.currentAttr.value+=String.fromCodePoint(e);break;case a.EOF:this._err(T.eofInTag),this._emitEOFToken();break;default:this.currentAttr.value+=String.fromCodePoint(e);}}_stateAfterAttributeValueQuoted(e){switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:this._leaveAttrValue(),this.state=P.BEFORE_ATTRIBUTE_NAME;break;case a.SOLIDUS:this._leaveAttrValue(),this.state=P.SELF_CLOSING_START_TAG;break;case a.GREATER_THAN_SIGN:this._leaveAttrValue(),this.state=P.DATA,this.emitCurrentTagToken();break;case a.EOF:this._err(T.eofInTag),this._emitEOFToken();break;default:this._err(T.missingWhitespaceBetweenAttributes),this.state=P.BEFORE_ATTRIBUTE_NAME,this._stateBeforeAttributeName(e);}}_stateSelfClosingStartTag(e){switch(e){case a.GREATER_THAN_SIGN:this.currentToken.selfClosing=!0,this.state=P.DATA,this.emitCurrentTagToken();break;case a.EOF:this._err(T.eofInTag),this._emitEOFToken();break;default:this._err(T.unexpectedSolidusInTag),this.state=P.BEFORE_ATTRIBUTE_NAME,this._stateBeforeAttributeName(e);}}_stateBogusComment(e){const t=this.currentToken;switch(e){case a.GREATER_THAN_SIGN:this.state=P.DATA,this.emitCurrentComment(t);break;case a.EOF:this.emitCurrentComment(t),this._emitEOFToken();break;case a.NULL:this._err(T.unexpectedNullCharacter),t.data+=s;break;default:t.data+=String.fromCodePoint(e);}}_stateMarkupDeclarationOpen(e){this._consumeSequenceIfMatch("--",!0)?(this._createCommentToken(3),this.state=P.COMMENT_START):this._consumeSequenceIfMatch(n,!1)?(this.currentLocation=this.getCurrentLocation(8),this.state=P.DOCTYPE):this._consumeSequenceIfMatch(r,!0)?this.inForeignNode?this.state=P.CDATA_SECTION:(this._err(T.cdataInHtmlContent),this._createCommentToken(8),this.currentToken.data="[CDATA[",this.state=P.BOGUS_COMMENT):this._ensureHibernation()||(this._err(T.incorrectlyOpenedComment),this._createCommentToken(2),this.state=P.BOGUS_COMMENT,this._stateBogusComment(e));}_stateCommentStart(e){switch(e){case a.HYPHEN_MINUS:this.state=P.COMMENT_START_DASH;break;case a.GREATER_THAN_SIGN:{this._err(T.abruptClosingOfEmptyComment),this.state=P.DATA;const e=this.currentToken;this.emitCurrentComment(e);break}default:this.state=P.COMMENT,this._stateComment(e);}}_stateCommentStartDash(e){const t=this.currentToken;switch(e){case a.HYPHEN_MINUS:this.state=P.COMMENT_END;break;case a.GREATER_THAN_SIGN:this._err(T.abruptClosingOfEmptyComment),this.state=P.DATA,this.emitCurrentComment(t);break;case a.EOF:this._err(T.eofInComment),this.emitCurrentComment(t),this._emitEOFToken();break;default:t.data+="-",this.state=P.COMMENT,this._stateComment(e);}}_stateComment(e){const t=this.currentToken;switch(e){case a.HYPHEN_MINUS:this.state=P.COMMENT_END_DASH;break;case a.LESS_THAN_SIGN:t.data+="<",this.state=P.COMMENT_LESS_THAN_SIGN;break;case a.NULL:this._err(T.unexpectedNullCharacter),t.data+=s;break;case a.EOF:this._err(T.eofInComment),this.emitCurrentComment(t),this._emitEOFToken();break;default:t.data+=String.fromCodePoint(e);}}_stateCommentLessThanSign(e){const t=this.currentToken;switch(e){case a.EXCLAMATION_MARK:t.data+="!",this.state=P.COMMENT_LESS_THAN_SIGN_BANG;break;case a.LESS_THAN_SIGN:t.data+="<";break;default:this.state=P.COMMENT,this._stateComment(e);}}_stateCommentLessThanSignBang(e){e===a.HYPHEN_MINUS?this.state=P.COMMENT_LESS_THAN_SIGN_BANG_DASH:(this.state=P.COMMENT,this._stateComment(e));}_stateCommentLessThanSignBangDash(e){e===a.HYPHEN_MINUS?this.state=P.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH:(this.state=P.COMMENT_END_DASH,this._stateCommentEndDash(e));}_stateCommentLessThanSignBangDashDash(e){e!==a.GREATER_THAN_SIGN&&e!==a.EOF&&this._err(T.nestedComment),this.state=P.COMMENT_END,this._stateCommentEnd(e);}_stateCommentEndDash(e){const t=this.currentToken;switch(e){case a.HYPHEN_MINUS:this.state=P.COMMENT_END;break;case a.EOF:this._err(T.eofInComment),this.emitCurrentComment(t),this._emitEOFToken();break;default:t.data+="-",this.state=P.COMMENT,this._stateComment(e);}}_stateCommentEnd(e){const t=this.currentToken;switch(e){case a.GREATER_THAN_SIGN:this.state=P.DATA,this.emitCurrentComment(t);break;case a.EXCLAMATION_MARK:this.state=P.COMMENT_END_BANG;break;case a.HYPHEN_MINUS:t.data+="-";break;case a.EOF:this._err(T.eofInComment),this.emitCurrentComment(t),this._emitEOFToken();break;default:t.data+="--",this.state=P.COMMENT,this._stateComment(e);}}_stateCommentEndBang(e){const t=this.currentToken;switch(e){case a.HYPHEN_MINUS:t.data+="--!",this.state=P.COMMENT_END_DASH;break;case a.GREATER_THAN_SIGN:this._err(T.incorrectlyClosedComment),this.state=P.DATA,this.emitCurrentComment(t);break;case a.EOF:this._err(T.eofInComment),this.emitCurrentComment(t),this._emitEOFToken();break;default:t.data+="--!",this.state=P.COMMENT,this._stateComment(e);}}_stateDoctype(e){switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:this.state=P.BEFORE_DOCTYPE_NAME;break;case a.GREATER_THAN_SIGN:this.state=P.BEFORE_DOCTYPE_NAME,this._stateBeforeDoctypeName(e);break;case a.EOF:{this._err(T.eofInDoctype),this._createDoctypeToken(null);const e=this.currentToken;e.forceQuirks=!0,this.emitCurrentDoctype(e),this._emitEOFToken();break}default:this._err(T.missingWhitespaceBeforeDoctypeName),this.state=P.BEFORE_DOCTYPE_NAME,this._stateBeforeDoctypeName(e);}}_stateBeforeDoctypeName(e){if(B(e))this._createDoctypeToken(String.fromCharCode(G(e))),this.state=P.DOCTYPE_NAME;else switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:break;case a.NULL:this._err(T.unexpectedNullCharacter),this._createDoctypeToken(s),this.state=P.DOCTYPE_NAME;break;case a.GREATER_THAN_SIGN:{this._err(T.missingDoctypeName),this._createDoctypeToken(null);const e=this.currentToken;e.forceQuirks=!0,this.emitCurrentDoctype(e),this.state=P.DATA;break}case a.EOF:{this._err(T.eofInDoctype),this._createDoctypeToken(null);const e=this.currentToken;e.forceQuirks=!0,this.emitCurrentDoctype(e),this._emitEOFToken();break}default:this._createDoctypeToken(String.fromCodePoint(e)),this.state=P.DOCTYPE_NAME;}}_stateDoctypeName(e){const t=this.currentToken;switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:this.state=P.AFTER_DOCTYPE_NAME;break;case a.GREATER_THAN_SIGN:this.state=P.DATA,this.emitCurrentDoctype(t);break;case a.NULL:this._err(T.unexpectedNullCharacter),t.name+=s;break;case a.EOF:this._err(T.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:t.name+=String.fromCodePoint(B(e)?G(e):e);}}_stateAfterDoctypeName(e){const t=this.currentToken;switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:break;case a.GREATER_THAN_SIGN:this.state=P.DATA,this.emitCurrentDoctype(t);break;case a.EOF:this._err(T.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._consumeSequenceIfMatch("public",!1)?this.state=P.AFTER_DOCTYPE_PUBLIC_KEYWORD:this._consumeSequenceIfMatch("system",!1)?this.state=P.AFTER_DOCTYPE_SYSTEM_KEYWORD:this._ensureHibernation()||(this._err(T.invalidCharacterSequenceAfterDoctypeName),t.forceQuirks=!0,this.state=P.BOGUS_DOCTYPE,this._stateBogusDoctype(e));}}_stateAfterDoctypePublicKeyword(e){const t=this.currentToken;switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:this.state=P.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER;break;case a.QUOTATION_MARK:this._err(T.missingWhitespaceAfterDoctypePublicKeyword),t.publicId="",this.state=P.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED;break;case a.APOSTROPHE:this._err(T.missingWhitespaceAfterDoctypePublicKeyword),t.publicId="",this.state=P.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED;break;case a.GREATER_THAN_SIGN:this._err(T.missingDoctypePublicIdentifier),t.forceQuirks=!0,this.state=P.DATA,this.emitCurrentDoctype(t);break;case a.EOF:this._err(T.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._err(T.missingQuoteBeforeDoctypePublicIdentifier),t.forceQuirks=!0,this.state=P.BOGUS_DOCTYPE,this._stateBogusDoctype(e);}}_stateBeforeDoctypePublicIdentifier(e){const t=this.currentToken;switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:break;case a.QUOTATION_MARK:t.publicId="",this.state=P.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED;break;case a.APOSTROPHE:t.publicId="",this.state=P.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED;break;case a.GREATER_THAN_SIGN:this._err(T.missingDoctypePublicIdentifier),t.forceQuirks=!0,this.state=P.DATA,this.emitCurrentDoctype(t);break;case a.EOF:this._err(T.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._err(T.missingQuoteBeforeDoctypePublicIdentifier),t.forceQuirks=!0,this.state=P.BOGUS_DOCTYPE,this._stateBogusDoctype(e);}}_stateDoctypePublicIdentifierDoubleQuoted(e){const t=this.currentToken;switch(e){case a.QUOTATION_MARK:this.state=P.AFTER_DOCTYPE_PUBLIC_IDENTIFIER;break;case a.NULL:this._err(T.unexpectedNullCharacter),t.publicId+=s;break;case a.GREATER_THAN_SIGN:this._err(T.abruptDoctypePublicIdentifier),t.forceQuirks=!0,this.emitCurrentDoctype(t),this.state=P.DATA;break;case a.EOF:this._err(T.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:t.publicId+=String.fromCodePoint(e);}}_stateDoctypePublicIdentifierSingleQuoted(e){const t=this.currentToken;switch(e){case a.APOSTROPHE:this.state=P.AFTER_DOCTYPE_PUBLIC_IDENTIFIER;break;case a.NULL:this._err(T.unexpectedNullCharacter),t.publicId+=s;break;case a.GREATER_THAN_SIGN:this._err(T.abruptDoctypePublicIdentifier),t.forceQuirks=!0,this.emitCurrentDoctype(t),this.state=P.DATA;break;case a.EOF:this._err(T.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:t.publicId+=String.fromCodePoint(e);}}_stateAfterDoctypePublicIdentifier(e){const t=this.currentToken;switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:this.state=P.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS;break;case a.GREATER_THAN_SIGN:this.state=P.DATA,this.emitCurrentDoctype(t);break;case a.QUOTATION_MARK:this._err(T.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers),t.systemId="",this.state=P.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;break;case a.APOSTROPHE:this._err(T.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers),t.systemId="",this.state=P.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;break;case a.EOF:this._err(T.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._err(T.missingQuoteBeforeDoctypeSystemIdentifier),t.forceQuirks=!0,this.state=P.BOGUS_DOCTYPE,this._stateBogusDoctype(e);}}_stateBetweenDoctypePublicAndSystemIdentifiers(e){const t=this.currentToken;switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:break;case a.GREATER_THAN_SIGN:this.emitCurrentDoctype(t),this.state=P.DATA;break;case a.QUOTATION_MARK:t.systemId="",this.state=P.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;break;case a.APOSTROPHE:t.systemId="",this.state=P.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;break;case a.EOF:this._err(T.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._err(T.missingQuoteBeforeDoctypeSystemIdentifier),t.forceQuirks=!0,this.state=P.BOGUS_DOCTYPE,this._stateBogusDoctype(e);}}_stateAfterDoctypeSystemKeyword(e){const t=this.currentToken;switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:this.state=P.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER;break;case a.QUOTATION_MARK:this._err(T.missingWhitespaceAfterDoctypeSystemKeyword),t.systemId="",this.state=P.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;break;case a.APOSTROPHE:this._err(T.missingWhitespaceAfterDoctypeSystemKeyword),t.systemId="",this.state=P.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;break;case a.GREATER_THAN_SIGN:this._err(T.missingDoctypeSystemIdentifier),t.forceQuirks=!0,this.state=P.DATA,this.emitCurrentDoctype(t);break;case a.EOF:this._err(T.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._err(T.missingQuoteBeforeDoctypeSystemIdentifier),t.forceQuirks=!0,this.state=P.BOGUS_DOCTYPE,this._stateBogusDoctype(e);}}_stateBeforeDoctypeSystemIdentifier(e){const t=this.currentToken;switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:break;case a.QUOTATION_MARK:t.systemId="",this.state=P.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;break;case a.APOSTROPHE:t.systemId="",this.state=P.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;break;case a.GREATER_THAN_SIGN:this._err(T.missingDoctypeSystemIdentifier),t.forceQuirks=!0,this.state=P.DATA,this.emitCurrentDoctype(t);break;case a.EOF:this._err(T.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._err(T.missingQuoteBeforeDoctypeSystemIdentifier),t.forceQuirks=!0,this.state=P.BOGUS_DOCTYPE,this._stateBogusDoctype(e);}}_stateDoctypeSystemIdentifierDoubleQuoted(e){const t=this.currentToken;switch(e){case a.QUOTATION_MARK:this.state=P.AFTER_DOCTYPE_SYSTEM_IDENTIFIER;break;case a.NULL:this._err(T.unexpectedNullCharacter),t.systemId+=s;break;case a.GREATER_THAN_SIGN:this._err(T.abruptDoctypeSystemIdentifier),t.forceQuirks=!0,this.emitCurrentDoctype(t),this.state=P.DATA;break;case a.EOF:this._err(T.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:t.systemId+=String.fromCodePoint(e);}}_stateDoctypeSystemIdentifierSingleQuoted(e){const t=this.currentToken;switch(e){case a.APOSTROPHE:this.state=P.AFTER_DOCTYPE_SYSTEM_IDENTIFIER;break;case a.NULL:this._err(T.unexpectedNullCharacter),t.systemId+=s;break;case a.GREATER_THAN_SIGN:this._err(T.abruptDoctypeSystemIdentifier),t.forceQuirks=!0,this.emitCurrentDoctype(t),this.state=P.DATA;break;case a.EOF:this._err(T.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:t.systemId+=String.fromCodePoint(e);}}_stateAfterDoctypeSystemIdentifier(e){const t=this.currentToken;switch(e){case a.SPACE:case a.LINE_FEED:case a.TABULATION:case a.FORM_FEED:break;case a.GREATER_THAN_SIGN:this.emitCurrentDoctype(t),this.state=P.DATA;break;case a.EOF:this._err(T.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._err(T.unexpectedCharacterAfterDoctypeSystemIdentifier),this.state=P.BOGUS_DOCTYPE,this._stateBogusDoctype(e);}}_stateBogusDoctype(e){const t=this.currentToken;switch(e){case a.GREATER_THAN_SIGN:this.emitCurrentDoctype(t),this.state=P.DATA;break;case a.NULL:this._err(T.unexpectedNullCharacter);break;case a.EOF:this.emitCurrentDoctype(t),this._emitEOFToken();}}_stateCdataSection(e){switch(e){case a.RIGHT_SQUARE_BRACKET:this.state=P.CDATA_SECTION_BRACKET;break;case a.EOF:this._err(T.eofInCdata),this._emitEOFToken();break;default:this._emitCodePoint(e);}}_stateCdataSectionBracket(e){e===a.RIGHT_SQUARE_BRACKET?this.state=P.CDATA_SECTION_END:(this._emitChars("]"),this.state=P.CDATA_SECTION,this._stateCdataSection(e));}_stateCdataSectionEnd(e){switch(e){case a.GREATER_THAN_SIGN:this.state=P.DATA;break;case a.RIGHT_SQUARE_BRACKET:this._emitChars("]");break;default:this._emitChars("]]"),this.state=P.CDATA_SECTION,this._stateCdataSection(e);}}_stateCharacterReference(e){e===a.NUMBER_SIGN?this.state=P.NUMERIC_CHARACTER_REFERENCE:F(e)?(this.state=P.NAMED_CHARACTER_REFERENCE,this._stateNamedCharacterReference(e)):(this._flushCodePointConsumedAsCharacterReference(a.AMPERSAND),this._reconsumeInState(this.returnState,e));}_stateNamedCharacterReference(e){const t=this._matchNamedCharacterReference(e);if(this._ensureHibernation());else if(t){for(let e=0;e<t.length;e++)this._flushCodePointConsumedAsCharacterReference(t[e]);this.state=this.returnState;}else this._flushCodePointConsumedAsCharacterReference(a.AMPERSAND),this.state=P.AMBIGUOUS_AMPERSAND;}_stateAmbiguousAmpersand(e){F(e)?this._flushCodePointConsumedAsCharacterReference(e):(e===a.SEMICOLON&&this._err(T.unknownNamedCharacterReference),this._reconsumeInState(this.returnState,e));}_stateNumericCharacterReference(e){this.charRefCode=0,e===a.LATIN_SMALL_X||e===a.LATIN_CAPITAL_X?this.state=P.HEXADEMICAL_CHARACTER_REFERENCE_START:b(e)?(this.state=P.DECIMAL_CHARACTER_REFERENCE,this._stateDecimalCharacterReference(e)):(this._err(T.absenceOfDigitsInNumericCharacterReference),this._flushCodePointConsumedAsCharacterReference(a.AMPERSAND),this._flushCodePointConsumedAsCharacterReference(a.NUMBER_SIGN),this._reconsumeInState(this.returnState,e));}_stateHexademicalCharacterReferenceStart(e){!function(e){return b(e)||U(e)||y(e)}(e)?(this._err(T.absenceOfDigitsInNumericCharacterReference),this._flushCodePointConsumedAsCharacterReference(a.AMPERSAND),this._flushCodePointConsumedAsCharacterReference(a.NUMBER_SIGN),this._unconsume(2),this.state=this.returnState):(this.state=P.HEXADEMICAL_CHARACTER_REFERENCE,this._stateHexademicalCharacterReference(e));}_stateHexademicalCharacterReference(e){U(e)?this.charRefCode=16*this.charRefCode+e-55:y(e)?this.charRefCode=16*this.charRefCode+e-87:b(e)?this.charRefCode=16*this.charRefCode+e-48:e===a.SEMICOLON?this.state=P.NUMERIC_CHARACTER_REFERENCE_END:(this._err(T.missingSemicolonAfterCharacterReference),this.state=P.NUMERIC_CHARACTER_REFERENCE_END,this._stateNumericCharacterReferenceEnd(e));}_stateDecimalCharacterReference(e){b(e)?this.charRefCode=10*this.charRefCode+e-48:e===a.SEMICOLON?this.state=P.NUMERIC_CHARACTER_REFERENCE_END:(this._err(T.missingSemicolonAfterCharacterReference),this.state=P.NUMERIC_CHARACTER_REFERENCE_END,this._stateNumericCharacterReferenceEnd(e));}_stateNumericCharacterReferenceEnd(e){if(this.charRefCode===a.NULL)this._err(T.nullCharacterReference),this.charRefCode=a.REPLACEMENT_CHARACTER;else if(this.charRefCode>1114111)this._err(T.characterReferenceOutsideUnicodeRange),this.charRefCode=a.REPLACEMENT_CHARACTER;else if(o(this.charRefCode))this._err(T.surrogateCharacterReference),this.charRefCode=a.REPLACEMENT_CHARACTER;else if(E(this.charRefCode))this._err(T.noncharacterCharacterReference);else if(c(this.charRefCode)||this.charRefCode===a.CARRIAGE_RETURN){this._err(T.controlCharacterReference);const e=g.get(this.charRefCode);void 0!==e&&(this.charRefCode=e);}this._flushCodePointConsumedAsCharacterReference(this.charRefCode),this._reconsumeInState(this.returnState,e);}}const v=new Set([S.DD,S.DT,S.LI,S.OPTGROUP,S.OPTION,S.P,S.RB,S.RP,S.RT,S.RTC]),Q=new Set([...v,S.CAPTION,S.COLGROUP,S.TBODY,S.TD,S.TFOOT,S.TH,S.THEAD,S.TR]),q=new Map([[S.APPLET,u.HTML],[S.CAPTION,u.HTML],[S.HTML,u.HTML],[S.MARQUEE,u.HTML],[S.OBJECT,u.HTML],[S.TABLE,u.HTML],[S.TD,u.HTML],[S.TEMPLATE,u.HTML],[S.TH,u.HTML],[S.ANNOTATION_XML,u.MATHML],[S.MI,u.MATHML],[S.MN,u.MATHML],[S.MO,u.MATHML],[S.MS,u.MATHML],[S.MTEXT,u.MATHML],[S.DESC,u.SVG],[S.FOREIGN_OBJECT,u.SVG],[S.TITLE,u.SVG]]),W=[S.H1,S.H2,S.H3,S.H4,S.H5,S.H6],X=[S.TR,S.TEMPLATE,S.HTML],K=[S.TBODY,S.TFOOT,S.THEAD,S.TEMPLATE,S.HTML],V=[S.TABLE,S.TEMPLATE,S.HTML],z=[S.TD,S.TH];class j{get currentTmplContentOrNode(){return this._isInTemplate()?this.treeAdapter.getTemplateContent(this.current):this.current}constructor(e,t,s){this.treeAdapter=t,this.handler=s,this.items=[],this.tagIDs=[],this.stackTop=-1,this.tmplCount=0,this.currentTagId=S.UNKNOWN,this.current=e;}_indexOf(e){return this.items.lastIndexOf(e,this.stackTop)}_isInTemplate(){return this.currentTagId===S.TEMPLATE&&this.treeAdapter.getNamespaceURI(this.current)===u.HTML}_updateCurrentElement(){this.current=this.items[this.stackTop],this.currentTagId=this.tagIDs[this.stackTop];}push(e,t){this.stackTop++,this.items[this.stackTop]=e,this.current=e,this.tagIDs[this.stackTop]=t,this.currentTagId=t,this._isInTemplate()&&this.tmplCount++,this.handler.onItemPush(e,t,!0);}pop(){const e=this.current;this.tmplCount>0&&this._isInTemplate()&&this.tmplCount--,this.stackTop--,this._updateCurrentElement(),this.handler.onItemPop(e,!0);}replace(e,t){const s=this._indexOf(e);this.items[s]=t,s===this.stackTop&&(this.current=t);}insertAfter(e,t,s){const a=this._indexOf(e)+1;this.items.splice(a,0,t),this.tagIDs.splice(a,0,s),this.stackTop++,a===this.stackTop&&this._updateCurrentElement(),this.handler.onItemPush(this.current,this.currentTagId,a===this.stackTop);}popUntilTagNamePopped(e){let t=this.stackTop+1;do{t=this.tagIDs.lastIndexOf(e,t-1);}while(t>0&&this.treeAdapter.getNamespaceURI(this.items[t])!==u.HTML);this.shortenToLength(t<0?0:t);}shortenToLength(e){for(;this.stackTop>=e;){const t=this.current;this.tmplCount>0&&this._isInTemplate()&&(this.tmplCount-=1),this.stackTop--,this._updateCurrentElement(),this.handler.onItemPop(t,this.stackTop<e);}}popUntilElementPopped(e){const t=this._indexOf(e);this.shortenToLength(t<0?0:t);}popUntilPopped(e,t){const s=this._indexOfTagNames(e,t);this.shortenToLength(s<0?0:s);}popUntilNumberedHeaderPopped(){this.popUntilPopped(W,u.HTML);}popUntilTableCellPopped(){this.popUntilPopped(z,u.HTML);}popAllUpToHtmlElement(){this.tmplCount=0,this.shortenToLength(1);}_indexOfTagNames(e,t){for(let s=this.stackTop;s>=0;s--)if(e.includes(this.tagIDs[s])&&this.treeAdapter.getNamespaceURI(this.items[s])===t)return s;return -1}clearBackTo(e,t){const s=this._indexOfTagNames(e,t);this.shortenToLength(s+1);}clearBackToTableContext(){this.clearBackTo(V,u.HTML);}clearBackToTableBodyContext(){this.clearBackTo(K,u.HTML);}clearBackToTableRowContext(){this.clearBackTo(X,u.HTML);}remove(e){const t=this._indexOf(e);t>=0&&(t===this.stackTop?this.pop():(this.items.splice(t,1),this.tagIDs.splice(t,1),this.stackTop--,this._updateCurrentElement(),this.handler.onItemPop(e,!1)));}tryPeekProperlyNestedBodyElement(){return this.stackTop>=1&&this.tagIDs[1]===S.BODY?this.items[1]:null}contains(e){return this._indexOf(e)>-1}getCommonAncestor(e){const t=this._indexOf(e)-1;return t>=0?this.items[t]:null}isRootHtmlElementCurrent(){return 0===this.stackTop&&this.tagIDs[0]===S.HTML}hasInScope(e){for(let t=this.stackTop;t>=0;t--){const s=this.tagIDs[t],a=this.treeAdapter.getNamespaceURI(this.items[t]);if(s===e&&a===u.HTML)return !0;if(q.get(s)===a)return !1}return !0}hasNumberedHeaderInScope(){for(let e=this.stackTop;e>=0;e--){const t=this.tagIDs[e],s=this.treeAdapter.getNamespaceURI(this.items[e]);if(M(t)&&s===u.HTML)return !0;if(q.get(t)===s)return !1}return !0}hasInListItemScope(e){for(let t=this.stackTop;t>=0;t--){const s=this.tagIDs[t],a=this.treeAdapter.getNamespaceURI(this.items[t]);if(s===e&&a===u.HTML)return !0;if((s===S.UL||s===S.OL)&&a===u.HTML||q.get(s)===a)return !1}return !0}hasInButtonScope(e){for(let t=this.stackTop;t>=0;t--){const s=this.tagIDs[t],a=this.treeAdapter.getNamespaceURI(this.items[t]);if(s===e&&a===u.HTML)return !0;if(s===S.BUTTON&&a===u.HTML||q.get(s)===a)return !1}return !0}hasInTableScope(e){for(let t=this.stackTop;t>=0;t--){const s=this.tagIDs[t];if(this.treeAdapter.getNamespaceURI(this.items[t])===u.HTML){if(s===e)return !0;if(s===S.TABLE||s===S.TEMPLATE||s===S.HTML)return !1}}return !0}hasTableBodyContextInTableScope(){for(let e=this.stackTop;e>=0;e--){const t=this.tagIDs[e];if(this.treeAdapter.getNamespaceURI(this.items[e])===u.HTML){if(t===S.TBODY||t===S.THEAD||t===S.TFOOT)return !0;if(t===S.TABLE||t===S.HTML)return !1}}return !0}hasInSelectScope(e){for(let t=this.stackTop;t>=0;t--){const s=this.tagIDs[t];if(this.treeAdapter.getNamespaceURI(this.items[t])===u.HTML){if(s===e)return !0;if(s!==S.OPTION&&s!==S.OPTGROUP)return !1}}return !0}generateImpliedEndTags(){for(;v.has(this.currentTagId);)this.pop();}generateImpliedEndTagsThoroughly(){for(;Q.has(this.currentTagId);)this.pop();}generateImpliedEndTagsWithExclusion(e){for(;this.currentTagId!==e&&Q.has(this.currentTagId);)this.pop();}}var J;!function(e){e[e.Marker=0]="Marker",e[e.Element=1]="Element";}(J=J||(J={}));const Z={type:J.Marker};class ${constructor(e){this.treeAdapter=e,this.entries=[],this.bookmark=null;}_getNoahArkConditionCandidates(e,t){const s=[],a=t.length,r=this.treeAdapter.getTagName(e),n=this.treeAdapter.getNamespaceURI(e);for(let e=0;e<this.entries.length;e++){const t=this.entries[e];if(t.type===J.Marker)break;const{element:i}=t;if(this.treeAdapter.getTagName(i)===r&&this.treeAdapter.getNamespaceURI(i)===n){const t=this.treeAdapter.getAttrList(i);t.length===a&&s.push({idx:e,attrs:t});}}return s}_ensureNoahArkCondition(e){if(this.entries.length<3)return;const t=this.treeAdapter.getAttrList(e),s=this._getNoahArkConditionCandidates(e,t);if(s.length<3)return;const a=new Map(t.map((e=>[e.name,e.value])));let r=0;for(let e=0;e<s.length;e++){const t=s[e];t.attrs.every((e=>a.get(e.name)===e.value))&&(r+=1,r>=3&&this.entries.splice(t.idx,1));}}insertMarker(){this.entries.unshift(Z);}pushElement(e,t){this._ensureNoahArkCondition(e),this.entries.unshift({type:J.Element,element:e,token:t});}insertElementAfterBookmark(e,t){const s=this.entries.indexOf(this.bookmark);this.entries.splice(s,0,{type:J.Element,element:e,token:t});}removeEntry(e){const t=this.entries.indexOf(e);t>=0&&this.entries.splice(t,1);}clearToLastMarker(){const e=this.entries.indexOf(Z);e>=0?this.entries.splice(0,e+1):this.entries.length=0;}getElementEntryInScopeWithTagName(e){const t=this.entries.find((t=>t.type===J.Marker||this.treeAdapter.getTagName(t.element)===e));return t&&t.type===J.Element?t:null}getElementEntry(e){return this.entries.find((t=>t.type===J.Element&&t.element===e))}}function ee(e){return {nodeName:"#text",value:e,parentNode:null}}const te={createDocument:()=>({nodeName:"#document",mode:I.NO_QUIRKS,childNodes:[]}),createDocumentFragment:()=>({nodeName:"#document-fragment",childNodes:[]}),createElement:(e,t,s)=>({nodeName:e,tagName:e,attrs:s,namespaceURI:t,childNodes:[],parentNode:null}),createCommentNode:e=>({nodeName:"#comment",data:e,parentNode:null}),appendChild(e,t){e.childNodes.push(t),t.parentNode=e;},insertBefore(e,t,s){const a=e.childNodes.indexOf(s);e.childNodes.splice(a,0,t),t.parentNode=e;},setTemplateContent(e,t){e.content=t;},getTemplateContent:e=>e.content,setDocumentType(e,t,s,a){const r=e.childNodes.find((e=>"#documentType"===e.nodeName));if(r)r.name=t,r.publicId=s,r.systemId=a;else {const r={nodeName:"#documentType",name:t,publicId:s,systemId:a,parentNode:null};te.appendChild(e,r);}},setDocumentMode(e,t){e.mode=t;},getDocumentMode:e=>e.mode,detachNode(e){if(e.parentNode){const t=e.parentNode.childNodes.indexOf(e);e.parentNode.childNodes.splice(t,1),e.parentNode=null;}},insertText(e,t){if(e.childNodes.length>0){const s=e.childNodes[e.childNodes.length-1];if(te.isTextNode(s))return void(s.value+=t)}te.appendChild(e,ee(t));},insertTextBefore(e,t,s){const a=e.childNodes[e.childNodes.indexOf(s)-1];a&&te.isTextNode(a)?a.value+=t:te.insertBefore(e,ee(t),s);},adoptAttributes(e,t){const s=new Set(e.attrs.map((e=>e.name)));for(let a=0;a<t.length;a++)s.has(t[a].name)||e.attrs.push(t[a]);},getFirstChild:e=>e.childNodes[0],getChildNodes:e=>e.childNodes,getParentNode:e=>e.parentNode,getAttrList:e=>e.attrs,getTagName:e=>e.tagName,getNamespaceURI:e=>e.namespaceURI,getTextNodeContent:e=>e.value,getCommentNodeContent:e=>e.data,getDocumentTypeNodeName:e=>e.name,getDocumentTypeNodePublicId:e=>e.publicId,getDocumentTypeNodeSystemId:e=>e.systemId,isTextNode:e=>"#text"===e.nodeName,isCommentNode:e=>"#comment"===e.nodeName,isDocumentTypeNode:e=>"#documentType"===e.nodeName,isElementNode:e=>Object.prototype.hasOwnProperty.call(e,"tagName"),setNodeSourceCodeLocation(e,t){e.sourceCodeLocation=t;},getNodeSourceCodeLocation:e=>e.sourceCodeLocation,updateNodeSourceCodeLocation(e,t){e.sourceCodeLocation={...e.sourceCodeLocation,...t};}},se="html",ae=["+//silmaril//dtd html pro v0r11 19970101//","-//as//dtd html 3.0 aswedit + extensions//","-//advasoft ltd//dtd html 3.0 aswedit + extensions//","-//ietf//dtd html 2.0 level 1//","-//ietf//dtd html 2.0 level 2//","-//ietf//dtd html 2.0 strict level 1//","-//ietf//dtd html 2.0 strict level 2//","-//ietf//dtd html 2.0 strict//","-//ietf//dtd html 2.0//","-//ietf//dtd html 2.1e//","-//ietf//dtd html 3.0//","-//ietf//dtd html 3.2 final//","-//ietf//dtd html 3.2//","-//ietf//dtd html 3//","-//ietf//dtd html level 0//","-//ietf//dtd html level 1//","-//ietf//dtd html level 2//","-//ietf//dtd html level 3//","-//ietf//dtd html strict level 0//","-//ietf//dtd html strict level 1//","-//ietf//dtd html strict level 2//","-//ietf//dtd html strict level 3//","-//ietf//dtd html strict//","-//ietf//dtd html//","-//metrius//dtd metrius presentational//","-//microsoft//dtd internet explorer 2.0 html strict//","-//microsoft//dtd internet explorer 2.0 html//","-//microsoft//dtd internet explorer 2.0 tables//","-//microsoft//dtd internet explorer 3.0 html strict//","-//microsoft//dtd internet explorer 3.0 html//","-//microsoft//dtd internet explorer 3.0 tables//","-//netscape comm. corp.//dtd html//","-//netscape comm. corp.//dtd strict html//","-//o'reilly and associates//dtd html 2.0//","-//o'reilly and associates//dtd html extended 1.0//","-//o'reilly and associates//dtd html extended relaxed 1.0//","-//sq//dtd html 2.0 hotmetal + extensions//","-//softquad software//dtd hotmetal pro 6.0::19990601::extensions to html 4.0//","-//softquad//dtd hotmetal pro 4.0::19971010::extensions to html 4.0//","-//spyglass//dtd html 2.0 extended//","-//sun microsystems corp.//dtd hotjava html//","-//sun microsystems corp.//dtd hotjava strict html//","-//w3c//dtd html 3 1995-03-24//","-//w3c//dtd html 3.2 draft//","-//w3c//dtd html 3.2 final//","-//w3c//dtd html 3.2//","-//w3c//dtd html 3.2s draft//","-//w3c//dtd html 4.0 frameset//","-//w3c//dtd html 4.0 transitional//","-//w3c//dtd html experimental 19960712//","-//w3c//dtd html experimental 970421//","-//w3c//dtd w3 html//","-//w3o//dtd w3 html 3.0//","-//webtechs//dtd mozilla html 2.0//","-//webtechs//dtd mozilla html//"],re=[...ae,"-//w3c//dtd html 4.01 frameset//","-//w3c//dtd html 4.01 transitional//"],ne=new Set(["-//w3o//dtd w3 html strict 3.0//en//","-/w3c/dtd html 4.0 transitional/en","html"]),ie=["-//w3c//dtd xhtml 1.0 frameset//","-//w3c//dtd xhtml 1.0 transitional//"],oe=[...ie,"-//w3c//dtd html 4.01 frameset//","-//w3c//dtd html 4.01 transitional//"];function ce(e,t){return t.some((t=>e.startsWith(t)))}const Ee="text/html",Te="application/xhtml+xml",he="definitionurl",_e="definitionURL",Ae=new Map(["attributeName","attributeType","baseFrequency","baseProfile","calcMode","clipPathUnits","diffuseConstant","edgeMode","filterUnits","glyphRef","gradientTransform","gradientUnits","kernelMatrix","kernelUnitLength","keyPoints","keySplines","keyTimes","lengthAdjust","limitingConeAngle","markerHeight","markerUnits","markerWidth","maskContentUnits","maskUnits","numOctaves","pathLength","patternContentUnits","patternTransform","patternUnits","pointsAtX","pointsAtY","pointsAtZ","preserveAlpha","preserveAspectRatio","primitiveUnits","refX","refY","repeatCount","repeatDur","requiredExtensions","requiredFeatures","specularConstant","specularExponent","spreadMethod","startOffset","stdDeviation","stitchTiles","surfaceScale","systemLanguage","tableValues","targetX","targetY","textLength","viewBox","viewTarget","xChannelSelector","yChannelSelector","zoomAndPan"].map((e=>[e.toLowerCase(),e]))),le=new Map([["xlink:actuate",{prefix:"xlink",name:"actuate",namespace:u.XLINK}],["xlink:arcrole",{prefix:"xlink",name:"arcrole",namespace:u.XLINK}],["xlink:href",{prefix:"xlink",name:"href",namespace:u.XLINK}],["xlink:role",{prefix:"xlink",name:"role",namespace:u.XLINK}],["xlink:show",{prefix:"xlink",name:"show",namespace:u.XLINK}],["xlink:title",{prefix:"xlink",name:"title",namespace:u.XLINK}],["xlink:type",{prefix:"xlink",name:"type",namespace:u.XLINK}],["xml:base",{prefix:"xml",name:"base",namespace:u.XML}],["xml:lang",{prefix:"xml",name:"lang",namespace:u.XML}],["xml:space",{prefix:"xml",name:"space",namespace:u.XML}],["xmlns",{prefix:"",name:"xmlns",namespace:u.XMLNS}],["xmlns:xlink",{prefix:"xmlns",name:"xlink",namespace:u.XMLNS}]]),me=new Map(["altGlyph","altGlyphDef","altGlyphItem","animateColor","animateMotion","animateTransform","clipPath","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence","foreignObject","glyphRef","linearGradient","radialGradient","textPath"].map((e=>[e.toLowerCase(),e]))),de=new Set([S.B,S.BIG,S.BLOCKQUOTE,S.BODY,S.BR,S.CENTER,S.CODE,S.DD,S.DIV,S.DL,S.DT,S.EM,S.EMBED,S.H1,S.H2,S.H3,S.H4,S.H5,S.H6,S.HEAD,S.HR,S.I,S.IMG,S.LI,S.LISTING,S.MENU,S.META,S.NOBR,S.OL,S.P,S.PRE,S.RUBY,S.S,S.SMALL,S.SPAN,S.STRONG,S.STRIKE,S.SUB,S.SUP,S.TABLE,S.TT,S.U,S.UL,S.VAR]);function pe(e){for(let t=0;t<e.attrs.length;t++)if(e.attrs[t].name===he){e.attrs[t].name=_e;break}}function ue(e){for(let t=0;t<e.attrs.length;t++){const s=Ae.get(e.attrs[t].name);null!=s&&(e.attrs[t].name=s);}}function Ne(e){for(let t=0;t<e.attrs.length;t++){const s=le.get(e.attrs[t].name);s&&(e.attrs[t].prefix=s.prefix,e.attrs[t].name=s.name,e.attrs[t].namespace=s.namespace);}}const Ie="hidden",Ce=8,Se=3;var De;!function(e){e[e.INITIAL=0]="INITIAL",e[e.BEFORE_HTML=1]="BEFORE_HTML",e[e.BEFORE_HEAD=2]="BEFORE_HEAD",e[e.IN_HEAD=3]="IN_HEAD",e[e.IN_HEAD_NO_SCRIPT=4]="IN_HEAD_NO_SCRIPT",e[e.AFTER_HEAD=5]="AFTER_HEAD",e[e.IN_BODY=6]="IN_BODY",e[e.TEXT=7]="TEXT",e[e.IN_TABLE=8]="IN_TABLE",e[e.IN_TABLE_TEXT=9]="IN_TABLE_TEXT",e[e.IN_CAPTION=10]="IN_CAPTION",e[e.IN_COLUMN_GROUP=11]="IN_COLUMN_GROUP",e[e.IN_TABLE_BODY=12]="IN_TABLE_BODY",e[e.IN_ROW=13]="IN_ROW",e[e.IN_CELL=14]="IN_CELL",e[e.IN_SELECT=15]="IN_SELECT",e[e.IN_SELECT_IN_TABLE=16]="IN_SELECT_IN_TABLE",e[e.IN_TEMPLATE=17]="IN_TEMPLATE",e[e.AFTER_BODY=18]="AFTER_BODY",e[e.IN_FRAMESET=19]="IN_FRAMESET",e[e.AFTER_FRAMESET=20]="AFTER_FRAMESET",e[e.AFTER_AFTER_BODY=21]="AFTER_AFTER_BODY",e[e.AFTER_AFTER_FRAMESET=22]="AFTER_AFTER_FRAMESET";}(De||(De={}));const Re={startLine:-1,startCol:-1,startOffset:-1,endLine:-1,endCol:-1,endOffset:-1},Oe=new Set([S.TABLE,S.TBODY,S.TFOOT,S.THEAD,S.TR]),fe={scriptingEnabled:!0,sourceCodeLocationInfo:!1,treeAdapter:te,onParseError:null};class Le{constructor(e,t,s=null,a=null){this.fragmentContext=s,this.scriptHandler=a,this.currentToken=null,this.stopped=!1,this.insertionMode=De.INITIAL,this.originalInsertionMode=De.INITIAL,this.headElement=null,this.formElement=null,this.currentNotInHTML=!1,this.tmplInsertionModeStack=[],this.pendingCharacterTokens=[],this.hasNonWhitespacePendingCharacterToken=!1,this.framesetOk=!0,this.skipNextNewLine=!1,this.fosterParentingEnabled=!1,this.options={...fe,...e},this.treeAdapter=this.options.treeAdapter,this.onParseError=this.options.onParseError,this.onParseError&&(this.options.sourceCodeLocationInfo=!0),this.document=null!=t?t:this.treeAdapter.createDocument(),this.tokenizer=new Y(this.options,this),this.activeFormattingElements=new $(this.treeAdapter),this.fragmentContextID=s?O(this.treeAdapter.getTagName(s)):S.UNKNOWN,this._setContextModes(null!=s?s:this.document,this.fragmentContextID),this.openElements=new j(this.document,this.treeAdapter,this);}static parse(e,t){const s=new this(t);return s.tokenizer.write(e,!0),s.document}static getFragmentParser(e,t){const s={...fe,...t};null!=e||(e=s.treeAdapter.createElement(C.TEMPLATE,u.HTML,[]));const a=s.treeAdapter.createElement("documentmock",u.HTML,[]),r=new this(s,a,e);return r.fragmentContextID===S.TEMPLATE&&r.tmplInsertionModeStack.unshift(De.IN_TEMPLATE),r._initTokenizerForFragmentParsing(),r._insertFakeRootElement(),r._resetInsertionMode(),r._findFormInFragmentContext(),r}getFragment(){const e=this.treeAdapter.getFirstChild(this.document),t=this.treeAdapter.createDocumentFragment();return this._adoptNodes(e,t),t}_err(e,t,s){var a;if(!this.onParseError)return;const r=null!==(a=e.location)&&void 0!==a?a:Re,n={code:t,startLine:r.startLine,startCol:r.startCol,startOffset:r.startOffset,endLine:s?r.startLine:r.endLine,endCol:s?r.startCol:r.endCol,endOffset:s?r.startOffset:r.endOffset};this.onParseError(n);}onItemPush(e,t,s){var a,r;null===(r=(a=this.treeAdapter).onItemPush)||void 0===r||r.call(a,e),s&&this.openElements.stackTop>0&&this._setContextModes(e,t);}onItemPop(e,t){var s,a;if(this.options.sourceCodeLocationInfo&&this._setEndLocation(e,this.currentToken),null===(a=(s=this.treeAdapter).onItemPop)||void 0===a||a.call(s,e,this.openElements.current),t){let e,t;0===this.openElements.stackTop&&this.fragmentContext?(e=this.fragmentContext,t=this.fragmentContextID):({current:e,currentTagId:t}=this.openElements),this._setContextModes(e,t);}}_setContextModes(e,t){const s=e===this.document||this.treeAdapter.getNamespaceURI(e)===u.HTML;this.currentNotInHTML=!s,this.tokenizer.inForeignNode=!s&&!this._isIntegrationPoint(t,e);}_switchToTextParsing(e,t){this._insertElement(e,u.HTML),this.tokenizer.state=t,this.originalInsertionMode=this.insertionMode,this.insertionMode=De.TEXT;}switchToPlaintextParsing(){this.insertionMode=De.TEXT,this.originalInsertionMode=De.IN_BODY,this.tokenizer.state=k.PLAINTEXT;}_getAdjustedCurrentElement(){return 0===this.openElements.stackTop&&this.fragmentContext?this.fragmentContext:this.openElements.current}_findFormInFragmentContext(){let e=this.fragmentContext;for(;e;){if(this.treeAdapter.getTagName(e)===C.FORM){this.formElement=e;break}e=this.treeAdapter.getParentNode(e);}}_initTokenizerForFragmentParsing(){if(this.fragmentContext&&this.treeAdapter.getNamespaceURI(this.fragmentContext)===u.HTML)switch(this.fragmentContextID){case S.TITLE:case S.TEXTAREA:this.tokenizer.state=k.RCDATA;break;case S.STYLE:case S.XMP:case S.IFRAME:case S.NOEMBED:case S.NOFRAMES:case S.NOSCRIPT:this.tokenizer.state=k.RAWTEXT;break;case S.SCRIPT:this.tokenizer.state=k.SCRIPT_DATA;break;case S.PLAINTEXT:this.tokenizer.state=k.PLAINTEXT;}}_setDocumentType(e){const t=e.name||"",s=e.publicId||"",a=e.systemId||"";if(this.treeAdapter.setDocumentType(this.document,t,s,a),e.location){const t=this.treeAdapter.getChildNodes(this.document).find((e=>this.treeAdapter.isDocumentTypeNode(e)));t&&this.treeAdapter.setNodeSourceCodeLocation(t,e.location);}}_attachElementToTree(e,t){if(this.options.sourceCodeLocationInfo){const s=t&&{...t,startTag:t};this.treeAdapter.setNodeSourceCodeLocation(e,s);}if(this._shouldFosterParentOnInsertion())this._fosterParentElement(e);else {const t=this.openElements.currentTmplContentOrNode;this.treeAdapter.appendChild(t,e);}}_appendElement(e,t){const s=this.treeAdapter.createElement(e.tagName,t,e.attrs);this._attachElementToTree(s,e.location);}_insertElement(e,t){const s=this.treeAdapter.createElement(e.tagName,t,e.attrs);this._attachElementToTree(s,e.location),this.openElements.push(s,e.tagID);}_insertFakeElement(e,t){const s=this.treeAdapter.createElement(e,u.HTML,[]);this._attachElementToTree(s,null),this.openElements.push(s,t);}_insertTemplate(e){const t=this.treeAdapter.createElement(e.tagName,u.HTML,e.attrs),s=this.treeAdapter.createDocumentFragment();this.treeAdapter.setTemplateContent(t,s),this._attachElementToTree(t,e.location),this.openElements.push(t,e.tagID),this.options.sourceCodeLocationInfo&&this.treeAdapter.setNodeSourceCodeLocation(s,null);}_insertFakeRootElement(){const e=this.treeAdapter.createElement(C.HTML,u.HTML,[]);this.options.sourceCodeLocationInfo&&this.treeAdapter.setNodeSourceCodeLocation(e,null),this.treeAdapter.appendChild(this.openElements.current,e),this.openElements.push(e,S.HTML);}_appendCommentNode(e,t){const s=this.treeAdapter.createCommentNode(e.data);this.treeAdapter.appendChild(t,s),this.options.sourceCodeLocationInfo&&this.treeAdapter.setNodeSourceCodeLocation(s,e.location);}_insertCharacters(e){let t,s;if(this._shouldFosterParentOnInsertion()?(({parent:t,beforeElement:s}=this._findFosterParentingLocation()),s?this.treeAdapter.insertTextBefore(t,e.chars,s):this.treeAdapter.insertText(t,e.chars)):(t=this.openElements.currentTmplContentOrNode,this.treeAdapter.insertText(t,e.chars)),!e.location)return;const a=this.treeAdapter.getChildNodes(t),r=s?a.lastIndexOf(s):a.length,n=a[r-1];if(this.treeAdapter.getNodeSourceCodeLocation(n)){const{endLine:t,endCol:s,endOffset:a}=e.location;this.treeAdapter.updateNodeSourceCodeLocation(n,{endLine:t,endCol:s,endOffset:a});}else this.options.sourceCodeLocationInfo&&this.treeAdapter.setNodeSourceCodeLocation(n,e.location);}_adoptNodes(e,t){for(let s=this.treeAdapter.getFirstChild(e);s;s=this.treeAdapter.getFirstChild(e))this.treeAdapter.detachNode(s),this.treeAdapter.appendChild(t,s);}_setEndLocation(e,t){if(this.treeAdapter.getNodeSourceCodeLocation(e)&&t.location){const s=t.location,a=this.treeAdapter.getTagName(e),r=t.type===h.END_TAG&&a===t.tagName?{endTag:{...s},endLine:s.endLine,endCol:s.endCol,endOffset:s.endOffset}:{endLine:s.startLine,endCol:s.startCol,endOffset:s.startOffset};this.treeAdapter.updateNodeSourceCodeLocation(e,r);}}shouldProcessStartTagTokenInForeignContent(e){if(!this.currentNotInHTML)return !1;let t,s;return 0===this.openElements.stackTop&&this.fragmentContext?(t=this.fragmentContext,s=this.fragmentContextID):({current:t,currentTagId:s}=this.openElements),(e.tagID!==S.SVG||this.treeAdapter.getTagName(t)!==C.ANNOTATION_XML||this.treeAdapter.getNamespaceURI(t)!==u.MATHML)&&(this.tokenizer.inForeignNode||(e.tagID===S.MGLYPH||e.tagID===S.MALIGNMARK)&&!this._isIntegrationPoint(s,t,u.HTML))}_processToken(e){switch(e.type){case h.CHARACTER:this.onCharacter(e);break;case h.NULL_CHARACTER:this.onNullCharacter(e);break;case h.COMMENT:this.onComment(e);break;case h.DOCTYPE:this.onDoctype(e);break;case h.START_TAG:this._processStartTag(e);break;case h.END_TAG:this.onEndTag(e);break;case h.EOF:this.onEof(e);break;case h.WHITESPACE_CHARACTER:this.onWhitespaceCharacter(e);}}_isIntegrationPoint(e,t,s){return function(e,t,s,a){return (!a||a===u.HTML)&&function(e,t,s){if(t===u.MATHML&&e===S.ANNOTATION_XML)for(let e=0;e<s.length;e++)if(s[e].name===N.ENCODING){const t=s[e].value.toLowerCase();return t===Ee||t===Te}return t===u.SVG&&(e===S.FOREIGN_OBJECT||e===S.DESC||e===S.TITLE)}(e,t,s)||(!a||a===u.MATHML)&&function(e,t){return t===u.MATHML&&(e===S.MI||e===S.MO||e===S.MN||e===S.MS||e===S.MTEXT)}(e,t)}(e,this.treeAdapter.getNamespaceURI(t),this.treeAdapter.getAttrList(t),s)}_reconstructActiveFormattingElements(){const e=this.activeFormattingElements.entries.length;if(e){const t=this.activeFormattingElements.entries.findIndex((e=>e.type===J.Marker||this.openElements.contains(e.element)));for(let s=t<0?e-1:t-1;s>=0;s--){const e=this.activeFormattingElements.entries[s];this._insertElement(e.token,this.treeAdapter.getNamespaceURI(e.element)),e.element=this.openElements.current;}}}_closeTableCell(){this.openElements.generateImpliedEndTags(),this.openElements.popUntilTableCellPopped(),this.activeFormattingElements.clearToLastMarker(),this.insertionMode=De.IN_ROW;}_closePElement(){this.openElements.generateImpliedEndTagsWithExclusion(S.P),this.openElements.popUntilTagNamePopped(S.P);}_resetInsertionMode(){for(let e=this.openElements.stackTop;e>=0;e--)switch(0===e&&this.fragmentContext?this.fragmentContextID:this.openElements.tagIDs[e]){case S.TR:return void(this.insertionMode=De.IN_ROW);case S.TBODY:case S.THEAD:case S.TFOOT:return void(this.insertionMode=De.IN_TABLE_BODY);case S.CAPTION:return void(this.insertionMode=De.IN_CAPTION);case S.COLGROUP:return void(this.insertionMode=De.IN_COLUMN_GROUP);case S.TABLE:return void(this.insertionMode=De.IN_TABLE);case S.BODY:return void(this.insertionMode=De.IN_BODY);case S.FRAMESET:return void(this.insertionMode=De.IN_FRAMESET);case S.SELECT:return void this._resetInsertionModeForSelect(e);case S.TEMPLATE:return void(this.insertionMode=this.tmplInsertionModeStack[0]);case S.HTML:return void(this.insertionMode=this.headElement?De.AFTER_HEAD:De.BEFORE_HEAD);case S.TD:case S.TH:if(e>0)return void(this.insertionMode=De.IN_CELL);break;case S.HEAD:if(e>0)return void(this.insertionMode=De.IN_HEAD)}this.insertionMode=De.IN_BODY;}_resetInsertionModeForSelect(e){if(e>0)for(let t=e-1;t>0;t--){const e=this.openElements.tagIDs[t];if(e===S.TEMPLATE)break;if(e===S.TABLE)return void(this.insertionMode=De.IN_SELECT_IN_TABLE)}this.insertionMode=De.IN_SELECT;}_isElementCausesFosterParenting(e){return Oe.has(e)}_shouldFosterParentOnInsertion(){return this.fosterParentingEnabled&&this._isElementCausesFosterParenting(this.openElements.currentTagId)}_findFosterParentingLocation(){for(let e=this.openElements.stackTop;e>=0;e--){const t=this.openElements.items[e];switch(this.openElements.tagIDs[e]){case S.TEMPLATE:if(this.treeAdapter.getNamespaceURI(t)===u.HTML)return {parent:this.treeAdapter.getTemplateContent(t),beforeElement:null};break;case S.TABLE:{const s=this.treeAdapter.getParentNode(t);return s?{parent:s,beforeElement:t}:{parent:this.openElements.items[e-1],beforeElement:null}}}}return {parent:this.openElements.items[0],beforeElement:null}}_fosterParentElement(e){const t=this._findFosterParentingLocation();t.beforeElement?this.treeAdapter.insertBefore(t.parent,e,t.beforeElement):this.treeAdapter.appendChild(t.parent,e);}_isSpecialElement(e,t){const s=this.treeAdapter.getNamespaceURI(e);return L[s].has(t)}onCharacter(e){if(this.skipNextNewLine=!1,this.tokenizer.inForeignNode)!function(e,t){e._insertCharacters(t),e.framesetOk=!1;}(this,e);else switch(this.insertionMode){case De.INITIAL:ye(this,e);break;case De.BEFORE_HTML:Ge(this,e);break;case De.BEFORE_HEAD:we(this,e);break;case De.IN_HEAD:ve(this,e);break;case De.IN_HEAD_NO_SCRIPT:Qe(this,e);break;case De.AFTER_HEAD:qe(this,e);break;case De.IN_BODY:case De.IN_CAPTION:case De.IN_CELL:case De.IN_TEMPLATE:Ke(this,e);break;case De.TEXT:case De.IN_SELECT:case De.IN_SELECT_IN_TABLE:this._insertCharacters(e);break;case De.IN_TABLE:case De.IN_TABLE_BODY:case De.IN_ROW:st(this,e);break;case De.IN_TABLE_TEXT:ot(this,e);break;case De.IN_COLUMN_GROUP:ht(this,e);break;case De.AFTER_BODY:It(this,e);break;case De.AFTER_AFTER_BODY:Ct(this,e);}}onNullCharacter(e){if(this.skipNextNewLine=!1,this.tokenizer.inForeignNode)!function(e,t){t.chars=s,e._insertCharacters(t);}(this,e);else switch(this.insertionMode){case De.INITIAL:ye(this,e);break;case De.BEFORE_HTML:Ge(this,e);break;case De.BEFORE_HEAD:we(this,e);break;case De.IN_HEAD:ve(this,e);break;case De.IN_HEAD_NO_SCRIPT:Qe(this,e);break;case De.AFTER_HEAD:qe(this,e);break;case De.TEXT:this._insertCharacters(e);break;case De.IN_TABLE:case De.IN_TABLE_BODY:case De.IN_ROW:st(this,e);break;case De.IN_COLUMN_GROUP:ht(this,e);break;case De.AFTER_BODY:It(this,e);break;case De.AFTER_AFTER_BODY:Ct(this,e);}}onComment(e){if(this.skipNextNewLine=!1,this.currentNotInHTML)Fe(this,e);else switch(this.insertionMode){case De.INITIAL:case De.BEFORE_HTML:case De.BEFORE_HEAD:case De.IN_HEAD:case De.IN_HEAD_NO_SCRIPT:case De.AFTER_HEAD:case De.IN_BODY:case De.IN_TABLE:case De.IN_CAPTION:case De.IN_COLUMN_GROUP:case De.IN_TABLE_BODY:case De.IN_ROW:case De.IN_CELL:case De.IN_SELECT:case De.IN_SELECT_IN_TABLE:case De.IN_TEMPLATE:case De.IN_FRAMESET:case De.AFTER_FRAMESET:Fe(this,e);break;case De.IN_TABLE_TEXT:ct(this,e);break;case De.AFTER_BODY:!function(e,t){e._appendCommentNode(t,e.openElements.items[0]);}(this,e);break;case De.AFTER_AFTER_BODY:case De.AFTER_AFTER_FRAMESET:!function(e,t){e._appendCommentNode(t,e.document);}(this,e);}}onDoctype(e){switch(this.skipNextNewLine=!1,this.insertionMode){case De.INITIAL:!function(e,t){e._setDocumentType(t);const s=t.forceQuirks?I.QUIRKS:function(e){if(e.name!==se)return I.QUIRKS;const{systemId:t}=e;if(t&&"http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd"===t.toLowerCase())return I.QUIRKS;let{publicId:s}=e;if(null!==s){if(s=s.toLowerCase(),ne.has(s))return I.QUIRKS;let e=null===t?re:ae;if(ce(s,e))return I.QUIRKS;if(e=null===t?ie:oe,ce(s,e))return I.LIMITED_QUIRKS}return I.NO_QUIRKS}(t);(((function(e){return e.name===se&&null===e.publicId&&(null===e.systemId||"about:legacy-compat"===e.systemId)})))(t)||e._err(t,T.nonConformingDoctype),e.treeAdapter.setDocumentMode(e.document,s),e.insertionMode=De.BEFORE_HTML;}(this,e);break;case De.BEFORE_HEAD:case De.IN_HEAD:case De.IN_HEAD_NO_SCRIPT:case De.AFTER_HEAD:this._err(e,T.misplacedDoctype);break;case De.IN_TABLE_TEXT:ct(this,e);}}onStartTag(e){this.skipNextNewLine=!1,this.currentToken=e,this._processStartTag(e),e.selfClosing&&!e.ackSelfClosing&&this._err(e,T.nonVoidHtmlElementStartTagWithTrailingSolidus);}_processStartTag(e){this.shouldProcessStartTagTokenInForeignContent(e)?function(e,t){if(function(e){const t=e.tagID;return t===S.FONT&&e.attrs.some((({name:e})=>e===N.COLOR||e===N.SIZE||e===N.FACE))||de.has(t)}(t))St(e),e._startTagOutsideForeignContent(t);else {const s=e._getAdjustedCurrentElement(),a=e.treeAdapter.getNamespaceURI(s);a===u.MATHML?pe(t):a===u.SVG&&(function(e){const t=me.get(e.tagName);null!=t&&(e.tagName=t,e.tagID=O(e.tagName));}(t),ue(t)),Ne(t),t.selfClosing?e._appendElement(t,a):e._insertElement(t,a),t.ackSelfClosing=!0;}}(this,e):this._startTagOutsideForeignContent(e);}_startTagOutsideForeignContent(e){switch(this.insertionMode){case De.INITIAL:ye(this,e);break;case De.BEFORE_HTML:!function(e,t){t.tagID===S.HTML?(e._insertElement(t,u.HTML),e.insertionMode=De.BEFORE_HEAD):Ge(e,t);}(this,e);break;case De.BEFORE_HEAD:!function(e,t){switch(t.tagID){case S.HTML:Ze(e,t);break;case S.HEAD:e._insertElement(t,u.HTML),e.headElement=e.openElements.current,e.insertionMode=De.IN_HEAD;break;default:we(e,t);}}(this,e);break;case De.IN_HEAD:xe(this,e);break;case De.IN_HEAD_NO_SCRIPT:!function(e,t){switch(t.tagID){case S.HTML:Ze(e,t);break;case S.BASEFONT:case S.BGSOUND:case S.HEAD:case S.LINK:case S.META:case S.NOFRAMES:case S.STYLE:xe(e,t);break;case S.NOSCRIPT:e._err(t,T.nestedNoscriptInHead);break;default:Qe(e,t);}}(this,e);break;case De.AFTER_HEAD:!function(e,t){switch(t.tagID){case S.HTML:Ze(e,t);break;case S.BODY:e._insertElement(t,u.HTML),e.framesetOk=!1,e.insertionMode=De.IN_BODY;break;case S.FRAMESET:e._insertElement(t,u.HTML),e.insertionMode=De.IN_FRAMESET;break;case S.BASE:case S.BASEFONT:case S.BGSOUND:case S.LINK:case S.META:case S.NOFRAMES:case S.SCRIPT:case S.STYLE:case S.TEMPLATE:case S.TITLE:e._err(t,T.abandonedHeadElementChild),e.openElements.push(e.headElement,S.HEAD),xe(e,t),e.openElements.remove(e.headElement);break;case S.HEAD:e._err(t,T.misplacedStartTagForHeadElement);break;default:qe(e,t);}}(this,e);break;case De.IN_BODY:Ze(this,e);break;case De.IN_TABLE:at(this,e);break;case De.IN_TABLE_TEXT:ct(this,e);break;case De.IN_CAPTION:!function(e,t){const s=t.tagID;Et.has(s)?e.openElements.hasInTableScope(S.CAPTION)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(S.CAPTION),e.activeFormattingElements.clearToLastMarker(),e.insertionMode=De.IN_TABLE,at(e,t)):Ze(e,t);}(this,e);break;case De.IN_COLUMN_GROUP:Tt(this,e);break;case De.IN_TABLE_BODY:_t(this,e);break;case De.IN_ROW:lt(this,e);break;case De.IN_CELL:!function(e,t){const s=t.tagID;Et.has(s)?(e.openElements.hasInTableScope(S.TD)||e.openElements.hasInTableScope(S.TH))&&(e._closeTableCell(),lt(e,t)):Ze(e,t);}(this,e);break;case De.IN_SELECT:dt(this,e);break;case De.IN_SELECT_IN_TABLE:!function(e,t){const s=t.tagID;s===S.CAPTION||s===S.TABLE||s===S.TBODY||s===S.TFOOT||s===S.THEAD||s===S.TR||s===S.TD||s===S.TH?(e.openElements.popUntilTagNamePopped(S.SELECT),e._resetInsertionMode(),e._processStartTag(t)):dt(e,t);}(this,e);break;case De.IN_TEMPLATE:!function(e,t){switch(t.tagID){case S.BASE:case S.BASEFONT:case S.BGSOUND:case S.LINK:case S.META:case S.NOFRAMES:case S.SCRIPT:case S.STYLE:case S.TEMPLATE:case S.TITLE:xe(e,t);break;case S.CAPTION:case S.COLGROUP:case S.TBODY:case S.TFOOT:case S.THEAD:e.tmplInsertionModeStack[0]=De.IN_TABLE,e.insertionMode=De.IN_TABLE,at(e,t);break;case S.COL:e.tmplInsertionModeStack[0]=De.IN_COLUMN_GROUP,e.insertionMode=De.IN_COLUMN_GROUP,Tt(e,t);break;case S.TR:e.tmplInsertionModeStack[0]=De.IN_TABLE_BODY,e.insertionMode=De.IN_TABLE_BODY,_t(e,t);break;case S.TD:case S.TH:e.tmplInsertionModeStack[0]=De.IN_ROW,e.insertionMode=De.IN_ROW,lt(e,t);break;default:e.tmplInsertionModeStack[0]=De.IN_BODY,e.insertionMode=De.IN_BODY,Ze(e,t);}}(this,e);break;case De.AFTER_BODY:!function(e,t){t.tagID===S.HTML?Ze(e,t):It(e,t);}(this,e);break;case De.IN_FRAMESET:!function(e,t){switch(t.tagID){case S.HTML:Ze(e,t);break;case S.FRAMESET:e._insertElement(t,u.HTML);break;case S.FRAME:e._appendElement(t,u.HTML),t.ackSelfClosing=!0;break;case S.NOFRAMES:xe(e,t);}}(this,e);break;case De.AFTER_FRAMESET:!function(e,t){switch(t.tagID){case S.HTML:Ze(e,t);break;case S.NOFRAMES:xe(e,t);}}(this,e);break;case De.AFTER_AFTER_BODY:!function(e,t){t.tagID===S.HTML?Ze(e,t):Ct(e,t);}(this,e);break;case De.AFTER_AFTER_FRAMESET:!function(e,t){switch(t.tagID){case S.HTML:Ze(e,t);break;case S.NOFRAMES:xe(e,t);}}(this,e);}}onEndTag(e){this.skipNextNewLine=!1,this.currentToken=e,this.currentNotInHTML?function(e,t){if(t.tagID===S.P||t.tagID===S.BR)return St(e),void e._endTagOutsideForeignContent(t);for(let s=e.openElements.stackTop;s>0;s--){const a=e.openElements.items[s];if(e.treeAdapter.getNamespaceURI(a)===u.HTML){e._endTagOutsideForeignContent(t);break}const r=e.treeAdapter.getTagName(a);if(r.toLowerCase()===t.tagName){t.tagName=r,e.openElements.shortenToLength(s);break}}}(this,e):this._endTagOutsideForeignContent(e);}_endTagOutsideForeignContent(e){switch(this.insertionMode){case De.INITIAL:ye(this,e);break;case De.BEFORE_HTML:!function(e,t){const s=t.tagID;s!==S.HTML&&s!==S.HEAD&&s!==S.BODY&&s!==S.BR||Ge(e,t);}(this,e);break;case De.BEFORE_HEAD:!function(e,t){const s=t.tagID;s===S.HEAD||s===S.BODY||s===S.HTML||s===S.BR?we(e,t):e._err(t,T.endTagWithoutMatchingOpenElement);}(this,e);break;case De.IN_HEAD:!function(e,t){switch(t.tagID){case S.HEAD:e.openElements.pop(),e.insertionMode=De.AFTER_HEAD;break;case S.BODY:case S.BR:case S.HTML:ve(e,t);break;case S.TEMPLATE:Ye(e,t);break;default:e._err(t,T.endTagWithoutMatchingOpenElement);}}(this,e);break;case De.IN_HEAD_NO_SCRIPT:!function(e,t){switch(t.tagID){case S.NOSCRIPT:e.openElements.pop(),e.insertionMode=De.IN_HEAD;break;case S.BR:Qe(e,t);break;default:e._err(t,T.endTagWithoutMatchingOpenElement);}}(this,e);break;case De.AFTER_HEAD:!function(e,t){switch(t.tagID){case S.BODY:case S.HTML:case S.BR:qe(e,t);break;case S.TEMPLATE:Ye(e,t);break;default:e._err(t,T.endTagWithoutMatchingOpenElement);}}(this,e);break;case De.IN_BODY:et(this,e);break;case De.TEXT:!function(e,t){var s;t.tagID===S.SCRIPT&&(null===(s=e.scriptHandler)||void 0===s||s.call(e,e.openElements.current)),e.openElements.pop(),e.insertionMode=e.originalInsertionMode;}(this,e);break;case De.IN_TABLE:rt(this,e);break;case De.IN_TABLE_TEXT:ct(this,e);break;case De.IN_CAPTION:!function(e,t){const s=t.tagID;switch(s){case S.CAPTION:case S.TABLE:e.openElements.hasInTableScope(S.CAPTION)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(S.CAPTION),e.activeFormattingElements.clearToLastMarker(),e.insertionMode=De.IN_TABLE,s===S.TABLE&&rt(e,t));break;case S.BODY:case S.COL:case S.COLGROUP:case S.HTML:case S.TBODY:case S.TD:case S.TFOOT:case S.TH:case S.THEAD:case S.TR:break;default:et(e,t);}}(this,e);break;case De.IN_COLUMN_GROUP:!function(e,t){switch(t.tagID){case S.COLGROUP:e.openElements.currentTagId===S.COLGROUP&&(e.openElements.pop(),e.insertionMode=De.IN_TABLE);break;case S.TEMPLATE:Ye(e,t);break;case S.COL:break;default:ht(e,t);}}(this,e);break;case De.IN_TABLE_BODY:At(this,e);break;case De.IN_ROW:mt(this,e);break;case De.IN_CELL:!function(e,t){const s=t.tagID;switch(s){case S.TD:case S.TH:e.openElements.hasInTableScope(s)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(s),e.activeFormattingElements.clearToLastMarker(),e.insertionMode=De.IN_ROW);break;case S.TABLE:case S.TBODY:case S.TFOOT:case S.THEAD:case S.TR:e.openElements.hasInTableScope(s)&&(e._closeTableCell(),mt(e,t));break;case S.BODY:case S.CAPTION:case S.COL:case S.COLGROUP:case S.HTML:break;default:et(e,t);}}(this,e);break;case De.IN_SELECT:pt(this,e);break;case De.IN_SELECT_IN_TABLE:!function(e,t){const s=t.tagID;s===S.CAPTION||s===S.TABLE||s===S.TBODY||s===S.TFOOT||s===S.THEAD||s===S.TR||s===S.TD||s===S.TH?e.openElements.hasInTableScope(s)&&(e.openElements.popUntilTagNamePopped(S.SELECT),e._resetInsertionMode(),e.onEndTag(t)):pt(e,t);}(this,e);break;case De.IN_TEMPLATE:!function(e,t){t.tagID===S.TEMPLATE&&Ye(e,t);}(this,e);break;case De.AFTER_BODY:Nt(this,e);break;case De.IN_FRAMESET:!function(e,t){t.tagID!==S.FRAMESET||e.openElements.isRootHtmlElementCurrent()||(e.openElements.pop(),e.fragmentContext||e.openElements.currentTagId===S.FRAMESET||(e.insertionMode=De.AFTER_FRAMESET));}(this,e);break;case De.AFTER_FRAMESET:!function(e,t){t.tagID===S.HTML&&(e.insertionMode=De.AFTER_AFTER_FRAMESET);}(this,e);break;case De.AFTER_AFTER_BODY:Ct(this,e);}}onEof(e){switch(this.insertionMode){case De.INITIAL:ye(this,e);break;case De.BEFORE_HTML:Ge(this,e);break;case De.BEFORE_HEAD:we(this,e);break;case De.IN_HEAD:ve(this,e);break;case De.IN_HEAD_NO_SCRIPT:Qe(this,e);break;case De.AFTER_HEAD:qe(this,e);break;case De.IN_BODY:case De.IN_TABLE:case De.IN_CAPTION:case De.IN_COLUMN_GROUP:case De.IN_TABLE_BODY:case De.IN_ROW:case De.IN_CELL:case De.IN_SELECT:case De.IN_SELECT_IN_TABLE:tt(this,e);break;case De.TEXT:!function(e,t){e._err(t,T.eofInElementThatCanContainOnlyText),e.openElements.pop(),e.insertionMode=e.originalInsertionMode,e.onEof(t);}(this,e);break;case De.IN_TABLE_TEXT:ct(this,e);break;case De.IN_TEMPLATE:ut(this,e);break;case De.AFTER_BODY:case De.IN_FRAMESET:case De.AFTER_FRAMESET:case De.AFTER_AFTER_BODY:case De.AFTER_AFTER_FRAMESET:Ue(this,e);}}onWhitespaceCharacter(e){if(this.skipNextNewLine&&(this.skipNextNewLine=!1,e.chars.charCodeAt(0)===a.LINE_FEED)){if(1===e.chars.length)return;e.chars=e.chars.substr(1);}if(this.tokenizer.inForeignNode)this._insertCharacters(e);else switch(this.insertionMode){case De.IN_HEAD:case De.IN_HEAD_NO_SCRIPT:case De.AFTER_HEAD:case De.TEXT:case De.IN_COLUMN_GROUP:case De.IN_SELECT:case De.IN_SELECT_IN_TABLE:case De.IN_FRAMESET:case De.AFTER_FRAMESET:this._insertCharacters(e);break;case De.IN_BODY:case De.IN_CAPTION:case De.IN_CELL:case De.IN_TEMPLATE:case De.AFTER_BODY:case De.AFTER_AFTER_BODY:case De.AFTER_AFTER_FRAMESET:Xe(this,e);break;case De.IN_TABLE:case De.IN_TABLE_BODY:case De.IN_ROW:st(this,e);break;case De.IN_TABLE_TEXT:it(this,e);}}}function Me(e,t){let s=e.activeFormattingElements.getElementEntryInScopeWithTagName(t.tagName);return s?e.openElements.contains(s.element)?e.openElements.hasInScope(t.tagID)||(s=null):(e.activeFormattingElements.removeEntry(s),s=null):$e(e,t),s}function ge(e,t){let s=null,a=e.openElements.stackTop;for(;a>=0;a--){const r=e.openElements.items[a];if(r===t.element)break;e._isSpecialElement(r,e.openElements.tagIDs[a])&&(s=r);}return s||(e.openElements.shortenToLength(a<0?0:a),e.activeFormattingElements.removeEntry(t)),s}function Pe(e,t,s){let a=t,r=e.openElements.getCommonAncestor(t);for(let n=0,i=r;i!==s;n++,i=r){r=e.openElements.getCommonAncestor(i);const s=e.activeFormattingElements.getElementEntry(i),o=s&&n>=Se;!s||o?(o&&e.activeFormattingElements.removeEntry(s),e.openElements.remove(i)):(i=ke(e,s),a===t&&(e.activeFormattingElements.bookmark=s),e.treeAdapter.detachNode(a),e.treeAdapter.appendChild(i,a),a=i);}return a}function ke(e,t){const s=e.treeAdapter.getNamespaceURI(t.element),a=e.treeAdapter.createElement(t.token.tagName,s,t.token.attrs);return e.openElements.replace(t.element,a),t.element=a,a}function be(e,t,s){const a=O(e.treeAdapter.getTagName(t));if(e._isElementCausesFosterParenting(a))e._fosterParentElement(s);else {const r=e.treeAdapter.getNamespaceURI(t);a===S.TEMPLATE&&r===u.HTML&&(t=e.treeAdapter.getTemplateContent(t)),e.treeAdapter.appendChild(t,s);}}function Be(e,t,s){const a=e.treeAdapter.getNamespaceURI(s.element),{token:r}=s,n=e.treeAdapter.createElement(r.tagName,a,r.attrs);e._adoptNodes(t,n),e.treeAdapter.appendChild(t,n),e.activeFormattingElements.insertElementAfterBookmark(n,r),e.activeFormattingElements.removeEntry(s),e.openElements.remove(s.element),e.openElements.insertAfter(t,n,r.tagID);}function He(e,t){for(let s=0;s<Ce;s++){const s=Me(e,t);if(!s)break;const a=ge(e,s);if(!a)break;e.activeFormattingElements.bookmark=s;const r=Pe(e,a,s.element),n=e.openElements.getCommonAncestor(s.element);e.treeAdapter.detachNode(r),n&&be(e,n,r),Be(e,a,s);}}function Fe(e,t){e._appendCommentNode(t,e.openElements.currentTmplContentOrNode);}function Ue(e,t){if(e.stopped=!0,t.location){const s=e.fragmentContext?0:2;for(let a=e.openElements.stackTop;a>=s;a--)e._setEndLocation(e.openElements.items[a],t);if(!e.fragmentContext&&e.openElements.stackTop>=0){const s=e.openElements.items[0],a=e.treeAdapter.getNodeSourceCodeLocation(s);if(a&&!a.endTag&&(e._setEndLocation(s,t),e.openElements.stackTop>=1)){const s=e.openElements.items[1],a=e.treeAdapter.getNodeSourceCodeLocation(s);a&&!a.endTag&&e._setEndLocation(s,t);}}}}function ye(e,t){e._err(t,T.missingDoctype,!0),e.treeAdapter.setDocumentMode(e.document,I.QUIRKS),e.insertionMode=De.BEFORE_HTML,e._processToken(t);}function Ge(e,t){e._insertFakeRootElement(),e.insertionMode=De.BEFORE_HEAD,e._processToken(t);}function we(e,t){e._insertFakeElement(C.HEAD,S.HEAD),e.headElement=e.openElements.current,e.insertionMode=De.IN_HEAD,e._processToken(t);}function xe(e,t){switch(t.tagID){case S.HTML:Ze(e,t);break;case S.BASE:case S.BASEFONT:case S.BGSOUND:case S.LINK:case S.META:e._appendElement(t,u.HTML),t.ackSelfClosing=!0;break;case S.TITLE:e._switchToTextParsing(t,k.RCDATA);break;case S.NOSCRIPT:e.options.scriptingEnabled?e._switchToTextParsing(t,k.RAWTEXT):(e._insertElement(t,u.HTML),e.insertionMode=De.IN_HEAD_NO_SCRIPT);break;case S.NOFRAMES:case S.STYLE:e._switchToTextParsing(t,k.RAWTEXT);break;case S.SCRIPT:e._switchToTextParsing(t,k.SCRIPT_DATA);break;case S.TEMPLATE:e._insertTemplate(t),e.activeFormattingElements.insertMarker(),e.framesetOk=!1,e.insertionMode=De.IN_TEMPLATE,e.tmplInsertionModeStack.unshift(De.IN_TEMPLATE);break;case S.HEAD:e._err(t,T.misplacedStartTagForHeadElement);break;default:ve(e,t);}}function Ye(e,t){e.openElements.tmplCount>0?(e.openElements.generateImpliedEndTagsThoroughly(),e.openElements.currentTagId!==S.TEMPLATE&&e._err(t,T.closingOfElementWithOpenChildElements),e.openElements.popUntilTagNamePopped(S.TEMPLATE),e.activeFormattingElements.clearToLastMarker(),e.tmplInsertionModeStack.shift(),e._resetInsertionMode()):e._err(t,T.endTagWithoutMatchingOpenElement);}function ve(e,t){e.openElements.pop(),e.insertionMode=De.AFTER_HEAD,e._processToken(t);}function Qe(e,t){const s=t.type===h.EOF?T.openElementsLeftAfterEof:T.disallowedContentInNoscriptInHead;e._err(t,s),e.openElements.pop(),e.insertionMode=De.IN_HEAD,e._processToken(t);}function qe(e,t){e._insertFakeElement(C.BODY,S.BODY),e.insertionMode=De.IN_BODY,We(e,t);}function We(e,t){switch(t.type){case h.CHARACTER:Ke(e,t);break;case h.WHITESPACE_CHARACTER:Xe(e,t);break;case h.COMMENT:Fe(e,t);break;case h.START_TAG:Ze(e,t);break;case h.END_TAG:et(e,t);break;case h.EOF:tt(e,t);}}function Xe(e,t){e._reconstructActiveFormattingElements(),e._insertCharacters(t);}function Ke(e,t){e._reconstructActiveFormattingElements(),e._insertCharacters(t),e.framesetOk=!1;}function Ve(e,t){e._reconstructActiveFormattingElements(),e._appendElement(t,u.HTML),e.framesetOk=!1,t.ackSelfClosing=!0;}function ze(e){const t=A(e,N.TYPE);return null!=t&&t.toLowerCase()===Ie}function je(e,t){e._switchToTextParsing(t,k.RAWTEXT);}function Je(e,t){e._reconstructActiveFormattingElements(),e._insertElement(t,u.HTML);}function Ze(e,t){switch(t.tagID){case S.I:case S.S:case S.B:case S.U:case S.EM:case S.TT:case S.BIG:case S.CODE:case S.FONT:case S.SMALL:case S.STRIKE:case S.STRONG:!function(e,t){e._reconstructActiveFormattingElements(),e._insertElement(t,u.HTML),e.activeFormattingElements.pushElement(e.openElements.current,t);}(e,t);break;case S.A:!function(e,t){const s=e.activeFormattingElements.getElementEntryInScopeWithTagName(C.A);s&&(He(e,t),e.openElements.remove(s.element),e.activeFormattingElements.removeEntry(s)),e._reconstructActiveFormattingElements(),e._insertElement(t,u.HTML),e.activeFormattingElements.pushElement(e.openElements.current,t);}(e,t);break;case S.H1:case S.H2:case S.H3:case S.H4:case S.H5:case S.H6:!function(e,t){e.openElements.hasInButtonScope(S.P)&&e._closePElement(),M(e.openElements.currentTagId)&&e.openElements.pop(),e._insertElement(t,u.HTML);}(e,t);break;case S.P:case S.DL:case S.OL:case S.UL:case S.DIV:case S.DIR:case S.NAV:case S.MAIN:case S.MENU:case S.ASIDE:case S.CENTER:case S.FIGURE:case S.FOOTER:case S.HEADER:case S.HGROUP:case S.DIALOG:case S.DETAILS:case S.ADDRESS:case S.ARTICLE:case S.SECTION:case S.SUMMARY:case S.FIELDSET:case S.BLOCKQUOTE:case S.FIGCAPTION:!function(e,t){e.openElements.hasInButtonScope(S.P)&&e._closePElement(),e._insertElement(t,u.HTML);}(e,t);break;case S.LI:case S.DD:case S.DT:!function(e,t){e.framesetOk=!1;const s=t.tagID;for(let t=e.openElements.stackTop;t>=0;t--){const a=e.openElements.tagIDs[t];if(s===S.LI&&a===S.LI||(s===S.DD||s===S.DT)&&(a===S.DD||a===S.DT)){e.openElements.generateImpliedEndTagsWithExclusion(a),e.openElements.popUntilTagNamePopped(a);break}if(a!==S.ADDRESS&&a!==S.DIV&&a!==S.P&&e._isSpecialElement(e.openElements.items[t],a))break}e.openElements.hasInButtonScope(S.P)&&e._closePElement(),e._insertElement(t,u.HTML);}(e,t);break;case S.BR:case S.IMG:case S.WBR:case S.AREA:case S.EMBED:case S.KEYGEN:Ve(e,t);break;case S.HR:!function(e,t){e.openElements.hasInButtonScope(S.P)&&e._closePElement(),e._appendElement(t,u.HTML),e.framesetOk=!1,t.ackSelfClosing=!0;}(e,t);break;case S.RB:case S.RTC:!function(e,t){e.openElements.hasInScope(S.RUBY)&&e.openElements.generateImpliedEndTags(),e._insertElement(t,u.HTML);}(e,t);break;case S.RT:case S.RP:!function(e,t){e.openElements.hasInScope(S.RUBY)&&e.openElements.generateImpliedEndTagsWithExclusion(S.RTC),e._insertElement(t,u.HTML);}(e,t);break;case S.PRE:case S.LISTING:!function(e,t){e.openElements.hasInButtonScope(S.P)&&e._closePElement(),e._insertElement(t,u.HTML),e.skipNextNewLine=!0,e.framesetOk=!1;}(e,t);break;case S.XMP:!function(e,t){e.openElements.hasInButtonScope(S.P)&&e._closePElement(),e._reconstructActiveFormattingElements(),e.framesetOk=!1,e._switchToTextParsing(t,k.RAWTEXT);}(e,t);break;case S.SVG:!function(e,t){e._reconstructActiveFormattingElements(),ue(t),Ne(t),t.selfClosing?e._appendElement(t,u.SVG):e._insertElement(t,u.SVG),t.ackSelfClosing=!0;}(e,t);break;case S.HTML:!function(e,t){0===e.openElements.tmplCount&&e.treeAdapter.adoptAttributes(e.openElements.items[0],t.attrs);}(e,t);break;case S.BASE:case S.LINK:case S.META:case S.STYLE:case S.TITLE:case S.SCRIPT:case S.BGSOUND:case S.BASEFONT:case S.TEMPLATE:xe(e,t);break;case S.BODY:!function(e,t){const s=e.openElements.tryPeekProperlyNestedBodyElement();s&&0===e.openElements.tmplCount&&(e.framesetOk=!1,e.treeAdapter.adoptAttributes(s,t.attrs));}(e,t);break;case S.FORM:!function(e,t){const s=e.openElements.tmplCount>0;e.formElement&&!s||(e.openElements.hasInButtonScope(S.P)&&e._closePElement(),e._insertElement(t,u.HTML),s||(e.formElement=e.openElements.current));}(e,t);break;case S.NOBR:!function(e,t){e._reconstructActiveFormattingElements(),e.openElements.hasInScope(S.NOBR)&&(He(e,t),e._reconstructActiveFormattingElements()),e._insertElement(t,u.HTML),e.activeFormattingElements.pushElement(e.openElements.current,t);}(e,t);break;case S.MATH:!function(e,t){e._reconstructActiveFormattingElements(),pe(t),Ne(t),t.selfClosing?e._appendElement(t,u.MATHML):e._insertElement(t,u.MATHML),t.ackSelfClosing=!0;}(e,t);break;case S.TABLE:!function(e,t){e.treeAdapter.getDocumentMode(e.document)!==I.QUIRKS&&e.openElements.hasInButtonScope(S.P)&&e._closePElement(),e._insertElement(t,u.HTML),e.framesetOk=!1,e.insertionMode=De.IN_TABLE;}(e,t);break;case S.INPUT:!function(e,t){e._reconstructActiveFormattingElements(),e._appendElement(t,u.HTML),ze(t)||(e.framesetOk=!1),t.ackSelfClosing=!0;}(e,t);break;case S.PARAM:case S.TRACK:case S.SOURCE:!function(e,t){e._appendElement(t,u.HTML),t.ackSelfClosing=!0;}(e,t);break;case S.IMAGE:!function(e,t){t.tagName=C.IMG,t.tagID=S.IMG,Ve(e,t);}(e,t);break;case S.BUTTON:!function(e,t){e.openElements.hasInScope(S.BUTTON)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(S.BUTTON)),e._reconstructActiveFormattingElements(),e._insertElement(t,u.HTML),e.framesetOk=!1;}(e,t);break;case S.APPLET:case S.OBJECT:case S.MARQUEE:!function(e,t){e._reconstructActiveFormattingElements(),e._insertElement(t,u.HTML),e.activeFormattingElements.insertMarker(),e.framesetOk=!1;}(e,t);break;case S.IFRAME:!function(e,t){e.framesetOk=!1,e._switchToTextParsing(t,k.RAWTEXT);}(e,t);break;case S.SELECT:!function(e,t){e._reconstructActiveFormattingElements(),e._insertElement(t,u.HTML),e.framesetOk=!1,e.insertionMode=e.insertionMode===De.IN_TABLE||e.insertionMode===De.IN_CAPTION||e.insertionMode===De.IN_TABLE_BODY||e.insertionMode===De.IN_ROW||e.insertionMode===De.IN_CELL?De.IN_SELECT_IN_TABLE:De.IN_SELECT;}(e,t);break;case S.OPTION:case S.OPTGROUP:!function(e,t){e.openElements.currentTagId===S.OPTION&&e.openElements.pop(),e._reconstructActiveFormattingElements(),e._insertElement(t,u.HTML);}(e,t);break;case S.NOEMBED:je(e,t);break;case S.FRAMESET:!function(e,t){const s=e.openElements.tryPeekProperlyNestedBodyElement();e.framesetOk&&s&&(e.treeAdapter.detachNode(s),e.openElements.popAllUpToHtmlElement(),e._insertElement(t,u.HTML),e.insertionMode=De.IN_FRAMESET);}(e,t);break;case S.TEXTAREA:!function(e,t){e._insertElement(t,u.HTML),e.skipNextNewLine=!0,e.tokenizer.state=k.RCDATA,e.originalInsertionMode=e.insertionMode,e.framesetOk=!1,e.insertionMode=De.TEXT;}(e,t);break;case S.NOSCRIPT:e.options.scriptingEnabled?je(e,t):Je(e,t);break;case S.PLAINTEXT:!function(e,t){e.openElements.hasInButtonScope(S.P)&&e._closePElement(),e._insertElement(t,u.HTML),e.tokenizer.state=k.PLAINTEXT;}(e,t);break;case S.COL:case S.TH:case S.TD:case S.TR:case S.HEAD:case S.FRAME:case S.TBODY:case S.TFOOT:case S.THEAD:case S.CAPTION:case S.COLGROUP:break;default:Je(e,t);}}function $e(e,t){const s=t.tagName,a=t.tagID;for(let t=e.openElements.stackTop;t>0;t--){const r=e.openElements.items[t],n=e.openElements.tagIDs[t];if(a===n&&(a!==S.UNKNOWN||e.treeAdapter.getTagName(r)===s)){e.openElements.generateImpliedEndTagsWithExclusion(a),e.openElements.stackTop>=t&&e.openElements.shortenToLength(t);break}if(e._isSpecialElement(r,n))break}}function et(e,t){switch(t.tagID){case S.A:case S.B:case S.I:case S.S:case S.U:case S.EM:case S.TT:case S.BIG:case S.CODE:case S.FONT:case S.NOBR:case S.SMALL:case S.STRIKE:case S.STRONG:He(e,t);break;case S.P:!function(e){e.openElements.hasInButtonScope(S.P)||e._insertFakeElement(C.P,S.P),e._closePElement();}(e);break;case S.DL:case S.UL:case S.OL:case S.DIR:case S.DIV:case S.NAV:case S.PRE:case S.MAIN:case S.MENU:case S.ASIDE:case S.BUTTON:case S.CENTER:case S.FIGURE:case S.FOOTER:case S.HEADER:case S.HGROUP:case S.DIALOG:case S.ADDRESS:case S.ARTICLE:case S.DETAILS:case S.SECTION:case S.SUMMARY:case S.LISTING:case S.FIELDSET:case S.BLOCKQUOTE:case S.FIGCAPTION:!function(e,t){const s=t.tagID;e.openElements.hasInScope(s)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(s));}(e,t);break;case S.LI:!function(e){e.openElements.hasInListItemScope(S.LI)&&(e.openElements.generateImpliedEndTagsWithExclusion(S.LI),e.openElements.popUntilTagNamePopped(S.LI));}(e);break;case S.DD:case S.DT:!function(e,t){const s=t.tagID;e.openElements.hasInScope(s)&&(e.openElements.generateImpliedEndTagsWithExclusion(s),e.openElements.popUntilTagNamePopped(s));}(e,t);break;case S.H1:case S.H2:case S.H3:case S.H4:case S.H5:case S.H6:!function(e){e.openElements.hasNumberedHeaderInScope()&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilNumberedHeaderPopped());}(e);break;case S.BR:!function(e){e._reconstructActiveFormattingElements(),e._insertFakeElement(C.BR,S.BR),e.openElements.pop(),e.framesetOk=!1;}(e);break;case S.BODY:!function(e,t){if(e.openElements.hasInScope(S.BODY)&&(e.insertionMode=De.AFTER_BODY,e.options.sourceCodeLocationInfo)){const s=e.openElements.tryPeekProperlyNestedBodyElement();s&&e._setEndLocation(s,t);}}(e,t);break;case S.HTML:!function(e,t){e.openElements.hasInScope(S.BODY)&&(e.insertionMode=De.AFTER_BODY,Nt(e,t));}(e,t);break;case S.FORM:!function(e){const t=e.openElements.tmplCount>0,{formElement:s}=e;t||(e.formElement=null),(s||t)&&e.openElements.hasInScope(S.FORM)&&(e.openElements.generateImpliedEndTags(),t?e.openElements.popUntilTagNamePopped(S.FORM):s&&e.openElements.remove(s));}(e);break;case S.APPLET:case S.OBJECT:case S.MARQUEE:!function(e,t){const s=t.tagID;e.openElements.hasInScope(s)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(s),e.activeFormattingElements.clearToLastMarker());}(e,t);break;case S.TEMPLATE:Ye(e,t);break;default:$e(e,t);}}function tt(e,t){e.tmplInsertionModeStack.length>0?ut(e,t):Ue(e,t);}function st(e,t){if(Oe.has(e.openElements.currentTagId))switch(e.pendingCharacterTokens.length=0,e.hasNonWhitespacePendingCharacterToken=!1,e.originalInsertionMode=e.insertionMode,e.insertionMode=De.IN_TABLE_TEXT,t.type){case h.CHARACTER:ot(e,t);break;case h.WHITESPACE_CHARACTER:it(e,t);}else nt(e,t);}function at(e,t){switch(t.tagID){case S.TD:case S.TH:case S.TR:!function(e,t){e.openElements.clearBackToTableContext(),e._insertFakeElement(C.TBODY,S.TBODY),e.insertionMode=De.IN_TABLE_BODY,_t(e,t);}(e,t);break;case S.STYLE:case S.SCRIPT:case S.TEMPLATE:xe(e,t);break;case S.COL:!function(e,t){e.openElements.clearBackToTableContext(),e._insertFakeElement(C.COLGROUP,S.COLGROUP),e.insertionMode=De.IN_COLUMN_GROUP,Tt(e,t);}(e,t);break;case S.FORM:!function(e,t){e.formElement||0!==e.openElements.tmplCount||(e._insertElement(t,u.HTML),e.formElement=e.openElements.current,e.openElements.pop());}(e,t);break;case S.TABLE:!function(e,t){e.openElements.hasInTableScope(S.TABLE)&&(e.openElements.popUntilTagNamePopped(S.TABLE),e._resetInsertionMode(),e._processStartTag(t));}(e,t);break;case S.TBODY:case S.TFOOT:case S.THEAD:!function(e,t){e.openElements.clearBackToTableContext(),e._insertElement(t,u.HTML),e.insertionMode=De.IN_TABLE_BODY;}(e,t);break;case S.INPUT:!function(e,t){ze(t)?e._appendElement(t,u.HTML):nt(e,t),t.ackSelfClosing=!0;}(e,t);break;case S.CAPTION:!function(e,t){e.openElements.clearBackToTableContext(),e.activeFormattingElements.insertMarker(),e._insertElement(t,u.HTML),e.insertionMode=De.IN_CAPTION;}(e,t);break;case S.COLGROUP:!function(e,t){e.openElements.clearBackToTableContext(),e._insertElement(t,u.HTML),e.insertionMode=De.IN_COLUMN_GROUP;}(e,t);break;default:nt(e,t);}}function rt(e,t){switch(t.tagID){case S.TABLE:e.openElements.hasInTableScope(S.TABLE)&&(e.openElements.popUntilTagNamePopped(S.TABLE),e._resetInsertionMode());break;case S.TEMPLATE:Ye(e,t);break;case S.BODY:case S.CAPTION:case S.COL:case S.COLGROUP:case S.HTML:case S.TBODY:case S.TD:case S.TFOOT:case S.TH:case S.THEAD:case S.TR:break;default:nt(e,t);}}function nt(e,t){const s=e.fosterParentingEnabled;e.fosterParentingEnabled=!0,We(e,t),e.fosterParentingEnabled=s;}function it(e,t){e.pendingCharacterTokens.push(t);}function ot(e,t){e.pendingCharacterTokens.push(t),e.hasNonWhitespacePendingCharacterToken=!0;}function ct(e,t){let s=0;if(e.hasNonWhitespacePendingCharacterToken)for(;s<e.pendingCharacterTokens.length;s++)nt(e,e.pendingCharacterTokens[s]);else for(;s<e.pendingCharacterTokens.length;s++)e._insertCharacters(e.pendingCharacterTokens[s]);e.insertionMode=e.originalInsertionMode,e._processToken(t);}const Et=new Set([S.CAPTION,S.COL,S.COLGROUP,S.TBODY,S.TD,S.TFOOT,S.TH,S.THEAD,S.TR]);function Tt(e,t){switch(t.tagID){case S.HTML:Ze(e,t);break;case S.COL:e._appendElement(t,u.HTML),t.ackSelfClosing=!0;break;case S.TEMPLATE:xe(e,t);break;default:ht(e,t);}}function ht(e,t){e.openElements.currentTagId===S.COLGROUP&&(e.openElements.pop(),e.insertionMode=De.IN_TABLE,e._processToken(t));}function _t(e,t){switch(t.tagID){case S.TR:e.openElements.clearBackToTableBodyContext(),e._insertElement(t,u.HTML),e.insertionMode=De.IN_ROW;break;case S.TH:case S.TD:e.openElements.clearBackToTableBodyContext(),e._insertFakeElement(C.TR,S.TR),e.insertionMode=De.IN_ROW,lt(e,t);break;case S.CAPTION:case S.COL:case S.COLGROUP:case S.TBODY:case S.TFOOT:case S.THEAD:e.openElements.hasTableBodyContextInTableScope()&&(e.openElements.clearBackToTableBodyContext(),e.openElements.pop(),e.insertionMode=De.IN_TABLE,at(e,t));break;default:at(e,t);}}function At(e,t){const s=t.tagID;switch(t.tagID){case S.TBODY:case S.TFOOT:case S.THEAD:e.openElements.hasInTableScope(s)&&(e.openElements.clearBackToTableBodyContext(),e.openElements.pop(),e.insertionMode=De.IN_TABLE);break;case S.TABLE:e.openElements.hasTableBodyContextInTableScope()&&(e.openElements.clearBackToTableBodyContext(),e.openElements.pop(),e.insertionMode=De.IN_TABLE,rt(e,t));break;case S.BODY:case S.CAPTION:case S.COL:case S.COLGROUP:case S.HTML:case S.TD:case S.TH:case S.TR:break;default:rt(e,t);}}function lt(e,t){switch(t.tagID){case S.TH:case S.TD:e.openElements.clearBackToTableRowContext(),e._insertElement(t,u.HTML),e.insertionMode=De.IN_CELL,e.activeFormattingElements.insertMarker();break;case S.CAPTION:case S.COL:case S.COLGROUP:case S.TBODY:case S.TFOOT:case S.THEAD:case S.TR:e.openElements.hasInTableScope(S.TR)&&(e.openElements.clearBackToTableRowContext(),e.openElements.pop(),e.insertionMode=De.IN_TABLE_BODY,_t(e,t));break;default:at(e,t);}}function mt(e,t){switch(t.tagID){case S.TR:e.openElements.hasInTableScope(S.TR)&&(e.openElements.clearBackToTableRowContext(),e.openElements.pop(),e.insertionMode=De.IN_TABLE_BODY);break;case S.TABLE:e.openElements.hasInTableScope(S.TR)&&(e.openElements.clearBackToTableRowContext(),e.openElements.pop(),e.insertionMode=De.IN_TABLE_BODY,At(e,t));break;case S.TBODY:case S.TFOOT:case S.THEAD:(e.openElements.hasInTableScope(t.tagID)||e.openElements.hasInTableScope(S.TR))&&(e.openElements.clearBackToTableRowContext(),e.openElements.pop(),e.insertionMode=De.IN_TABLE_BODY,At(e,t));break;case S.BODY:case S.CAPTION:case S.COL:case S.COLGROUP:case S.HTML:case S.TD:case S.TH:break;default:rt(e,t);}}function dt(e,t){switch(t.tagID){case S.HTML:Ze(e,t);break;case S.OPTION:e.openElements.currentTagId===S.OPTION&&e.openElements.pop(),e._insertElement(t,u.HTML);break;case S.OPTGROUP:e.openElements.currentTagId===S.OPTION&&e.openElements.pop(),e.openElements.currentTagId===S.OPTGROUP&&e.openElements.pop(),e._insertElement(t,u.HTML);break;case S.INPUT:case S.KEYGEN:case S.TEXTAREA:case S.SELECT:e.openElements.hasInSelectScope(S.SELECT)&&(e.openElements.popUntilTagNamePopped(S.SELECT),e._resetInsertionMode(),t.tagID!==S.SELECT&&e._processStartTag(t));break;case S.SCRIPT:case S.TEMPLATE:xe(e,t);}}function pt(e,t){switch(t.tagID){case S.OPTGROUP:e.openElements.stackTop>0&&e.openElements.currentTagId===S.OPTION&&e.openElements.tagIDs[e.openElements.stackTop-1]===S.OPTGROUP&&e.openElements.pop(),e.openElements.currentTagId===S.OPTGROUP&&e.openElements.pop();break;case S.OPTION:e.openElements.currentTagId===S.OPTION&&e.openElements.pop();break;case S.SELECT:e.openElements.hasInSelectScope(S.SELECT)&&(e.openElements.popUntilTagNamePopped(S.SELECT),e._resetInsertionMode());break;case S.TEMPLATE:Ye(e,t);}}function ut(e,t){e.openElements.tmplCount>0?(e.openElements.popUntilTagNamePopped(S.TEMPLATE),e.activeFormattingElements.clearToLastMarker(),e.tmplInsertionModeStack.shift(),e._resetInsertionMode(),e.onEof(t)):Ue(e,t);}function Nt(e,t){var s;if(t.tagID===S.HTML){if(e.fragmentContext||(e.insertionMode=De.AFTER_AFTER_BODY),e.options.sourceCodeLocationInfo&&e.openElements.tagIDs[0]===S.HTML){e._setEndLocation(e.openElements.items[0],t);const a=e.openElements.items[1];a&&!(null===(s=e.treeAdapter.getNodeSourceCodeLocation(a))||void 0===s?void 0:s.endTag)&&e._setEndLocation(a,t);}}else It(e,t);}function It(e,t){e.insertionMode=De.IN_BODY,We(e,t);}function Ct(e,t){e.insertionMode=De.IN_BODY,We(e,t);}function St(e){for(;e.treeAdapter.getNamespaceURI(e.openElements.current)!==u.HTML&&!e._isIntegrationPoint(e.openElements.currentTagId,e.openElements.current);)e.openElements.pop();}return new Set([C.AREA,C.BASE,C.BASEFONT,C.BGSOUND,C.BR,C.COL,C.EMBED,C.FRAME,C.HR,C.IMG,C.INPUT,C.KEYGEN,C.LINK,C.META,C.PARAM,C.SOURCE,C.TRACK,C.WBR]),e.parse=function(e,t){return Le.parse(e,t)},e.parseFragment=function(e,t,s){"string"==typeof e&&(s=t,t=e,e=null);const a=Le.getFragmentParser(e,s);return a.tokenizer.write(t,!0),a.getFragment()},Object.defineProperty(e,"__esModule",{value:!0}),e}({});const parse=e.parse;const parseFragment=e.parseFragment;

const docParser = new WeakMap();
function parseDocumentUtil(ownerDocument, html) {
    const doc = parse(html.trim(), getParser(ownerDocument));
    doc.documentElement = doc.firstElementChild;
    doc.head = doc.documentElement.firstElementChild;
    doc.body = doc.head.nextElementSibling;
    return doc;
}
function parseFragmentUtil(ownerDocument, html) {
    if (typeof html === 'string') {
        html = html.trim();
    }
    else {
        html = '';
    }
    const frag = parseFragment(html, getParser(ownerDocument));
    return frag;
}
function getParser(ownerDocument) {
    let parseOptions = docParser.get(ownerDocument);
    if (parseOptions != null) {
        return parseOptions;
    }
    const treeAdapter = {
        createDocument() {
            const doc = ownerDocument.createElement("#document" /* NODE_NAMES.DOCUMENT_NODE */);
            doc['x-mode'] = 'no-quirks';
            return doc;
        },
        setNodeSourceCodeLocation(node, location) {
            node.sourceCodeLocation = location;
        },
        getNodeSourceCodeLocation(node) {
            return node.sourceCodeLocation;
        },
        createDocumentFragment() {
            return ownerDocument.createDocumentFragment();
        },
        createElement(tagName, namespaceURI, attrs) {
            const elm = ownerDocument.createElementNS(namespaceURI, tagName);
            for (let i = 0; i < attrs.length; i++) {
                const attr = attrs[i];
                if (attr.namespace == null || attr.namespace === 'http://www.w3.org/1999/xhtml') {
                    elm.setAttribute(attr.name, attr.value);
                }
                else {
                    elm.setAttributeNS(attr.namespace, attr.name, attr.value);
                }
            }
            return elm;
        },
        createCommentNode(data) {
            return ownerDocument.createComment(data);
        },
        appendChild(parentNode, newNode) {
            parentNode.appendChild(newNode);
        },
        insertBefore(parentNode, newNode, referenceNode) {
            parentNode.insertBefore(newNode, referenceNode);
        },
        setTemplateContent(templateElement, contentElement) {
            templateElement.content = contentElement;
        },
        getTemplateContent(templateElement) {
            return templateElement.content;
        },
        setDocumentType(doc, name, publicId, systemId) {
            let doctypeNode = doc.childNodes.find((n) => n.nodeType === 10 /* NODE_TYPES.DOCUMENT_TYPE_NODE */);
            if (doctypeNode == null) {
                doctypeNode = ownerDocument.createDocumentTypeNode();
                doc.insertBefore(doctypeNode, doc.firstChild);
            }
            doctypeNode.nodeValue = '!DOCTYPE';
            doctypeNode['x-name'] = name;
            doctypeNode['x-publicId'] = publicId;
            doctypeNode['x-systemId'] = systemId;
        },
        setDocumentMode(doc, mode) {
            doc['x-mode'] = mode;
        },
        getDocumentMode(doc) {
            return doc['x-mode'];
        },
        detachNode(node) {
            node.remove();
        },
        insertText(parentNode, text) {
            const lastChild = parentNode.lastChild;
            if (lastChild != null && lastChild.nodeType === 3 /* NODE_TYPES.TEXT_NODE */) {
                lastChild.nodeValue += text;
            }
            else {
                parentNode.appendChild(ownerDocument.createTextNode(text));
            }
        },
        insertTextBefore(parentNode, text, referenceNode) {
            const prevNode = parentNode.childNodes[parentNode.childNodes.indexOf(referenceNode) - 1];
            if (prevNode != null && prevNode.nodeType === 3 /* NODE_TYPES.TEXT_NODE */) {
                prevNode.nodeValue += text;
            }
            else {
                parentNode.insertBefore(ownerDocument.createTextNode(text), referenceNode);
            }
        },
        adoptAttributes(recipient, attrs) {
            for (let i = 0; i < attrs.length; i++) {
                const attr = attrs[i];
                if (recipient.hasAttributeNS(attr.namespace, attr.name) === false) {
                    recipient.setAttributeNS(attr.namespace, attr.name, attr.value);
                }
            }
        },
        getFirstChild(node) {
            return node.childNodes[0];
        },
        getChildNodes(node) {
            return node.childNodes;
        },
        getParentNode(node) {
            return node.parentNode;
        },
        getAttrList(element) {
            const attrs = element.attributes.__items.map((attr) => {
                return {
                    name: attr.name,
                    value: attr.value,
                    namespace: attr.namespaceURI,
                    prefix: null,
                };
            });
            return attrs;
        },
        getTagName(element) {
            if (element.namespaceURI === 'http://www.w3.org/1999/xhtml') {
                return element.nodeName.toLowerCase();
            }
            else {
                return element.nodeName;
            }
        },
        getNamespaceURI(element) {
            // mock-doc widens the type of an element's namespace uri to 'string | null'
            // we use a type assertion here to adhere to parse5's type definitions
            return element.namespaceURI;
        },
        getTextNodeContent(textNode) {
            return textNode.nodeValue;
        },
        getCommentNodeContent(commentNode) {
            return commentNode.nodeValue;
        },
        getDocumentTypeNodeName(doctypeNode) {
            return doctypeNode['x-name'];
        },
        getDocumentTypeNodePublicId(doctypeNode) {
            return doctypeNode['x-publicId'];
        },
        getDocumentTypeNodeSystemId(doctypeNode) {
            return doctypeNode['x-systemId'];
        },
        // @ts-ignore - a `MockNode` will never be assignable to a `TreeAdapterTypeMap['text']`. As a result, we cannot
        // complete this function signature
        isTextNode(node) {
            return node.nodeType === 3 /* NODE_TYPES.TEXT_NODE */;
        },
        // @ts-ignore - a `MockNode` will never be assignable to a `TreeAdapterTypeMap['comment']`. As a result, we cannot
        // complete this function signature (which requires its return type to be a type predicate)
        isCommentNode(node) {
            return node.nodeType === 8 /* NODE_TYPES.COMMENT_NODE */;
        },
        // @ts-ignore - a `MockNode` will never be assignable to a `TreeAdapterTypeMap['document']`. As a result, we cannot
        // complete this function signature (which requires its return type to be a type predicate)
        isDocumentTypeNode(node) {
            return node.nodeType === 10 /* NODE_TYPES.DOCUMENT_TYPE_NODE */;
        },
        // @ts-ignore - a `MockNode` will never be assignable to a `TreeAdapterTypeMap['element']`. As a result, we cannot
        // complete this function signature (which requires its return type to be a type predicate)
        isElementNode(node) {
            return node.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */;
        },
    };
    parseOptions = {
        treeAdapter: treeAdapter,
    };
    docParser.set(ownerDocument, parseOptions);
    return parseOptions;
}

/* eslint-disable */
// @ts-nocheck
/**
 * ATTENTION: DO NOT MODIFY THIS FILE
 *
 * This file is generated by "scripts/updateSelectorEngine.ts" and can be overwritten
 * at any time. Don't make changes in here as they will get lost!
 */
const jQuery = /*!
 * jQuery JavaScript Library v4.0.0-pre+9352011a7.dirty +selector
 * https://jquery.com/
 *
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2023-12-11T17:55Z
 */ (function (global, factory) {
    {
        // For CommonJS and CommonJS-like environments where a proper `window`
        // is present, execute the factory and get jQuery.
        return factory(global, true);
    }
    // Pass this if window is not defined yet
})({
    document: {
        createElement() {
            return {};
        },
        nodeType: 9,
        documentElement: {
            nodeType: 1,
            nodeName: 'HTML'
        }
    }
}, function (window, noGlobal) {
    if (!window.document) {
        throw new Error("jQuery requires a window with a document");
    }
    var arr = [];
    var getProto = Object.getPrototypeOf;
    var slice = arr.slice;
    // Support: IE 11+
    // IE doesn't have Array#flat; provide a fallback.
    var flat = function (array) {
        return arr.concat.apply([], array);
    };
    var push = arr.push;
    var indexOf = arr.indexOf;
    // [[Class]] -> type pairs
    var class2type = {};
    var toString = class2type.toString;
    var hasOwn = class2type.hasOwnProperty;
    var fnToString = hasOwn.toString;
    var ObjectFunctionString = fnToString.call(Object);
    // All support tests are defined in their respective modules.
    var support = {};
    function toType(obj) {
        if (obj == null) {
            return obj + "";
        }
        return typeof obj === "object" ?
            class2type[toString.call(obj)] || "object" :
            typeof obj;
    }
    function isWindow(obj) {
        return obj != null && obj === obj.window;
    }
    function isArrayLike(obj) {
        var length = !!obj && obj.length, type = toType(obj);
        if (typeof obj === "function" || isWindow(obj)) {
            return false;
        }
        return type === "array" || length === 0 ||
            typeof length === "number" && length > 0 && (length - 1) in obj;
    }
    var document = window.document;
    var preservedScriptAttributes = {
        type: true,
        src: true,
        nonce: true,
        noModule: true
    };
    function DOMEval(code, node, doc) {
        doc = doc || document;
        var i, script = doc.createElement("script");
        script.text = code;
        if (node) {
            for (i in preservedScriptAttributes) {
                if (node[i]) {
                    script[i] = node[i];
                }
            }
        }
        doc.head.appendChild(script).parentNode.removeChild(script);
    }
    const jQuery = {};
    var version = "4.0.0-pre+9352011a7.dirty +selector", rhtmlSuffix = /HTML$/i; 
    jQuery.fn = jQuery.prototype = {
        // The current version of jQuery being used
        jquery: version,
        constructor: jQuery,
        // The default length of a jQuery object is 0
        length: 0,
        toArray: function () {
            return slice.call(this);
        },
        // Get the Nth element in the matched element set OR
        // Get the whole matched element set as a clean array
        get: function (num) {
            // Return all the elements in a clean array
            if (num == null) {
                return slice.call(this);
            }
            // Return just the one element from the set
            return num < 0 ? this[num + this.length] : this[num];
        },
        // Take an array of elements and push it onto the stack
        // (returning the new matched element set)
        pushStack: function (elems) {
            // Build a new jQuery matched element set
            var ret = jQuery.merge(this.constructor(), elems);
            // Add the old object onto the stack (as a reference)
            ret.prevObject = this;
            // Return the newly-formed element set
            return ret;
        },
        // Execute a callback for every element in the matched set.
        each: function (callback) {
            return jQuery.each(this, callback);
        },
        map: function (callback) {
            return this.pushStack(jQuery.map(this, function (elem, i) {
                return callback.call(elem, i, elem);
            }));
        },
        slice: function () {
            return this.pushStack(slice.apply(this, arguments));
        },
        first: function () {
            return this.eq(0);
        },
        last: function () {
            return this.eq(-1);
        },
        even: function () {
            return this.pushStack(jQuery.grep(this, function (_elem, i) {
                return (i + 1) % 2;
            }));
        },
        odd: function () {
            return this.pushStack(jQuery.grep(this, function (_elem, i) {
                return i % 2;
            }));
        },
        eq: function (i) {
            var len = this.length, j = +i + (i < 0 ? len : 0);
            return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
        },
        end: function () {
            return this.prevObject || this.constructor();
        }
    };
    jQuery.extend = jQuery.fn.extend = function () {
        var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;
        // Handle a deep copy situation
        if (typeof target === "boolean") {
            deep = target;
            // Skip the boolean and the target
            target = arguments[i] || {};
            i++;
        }
        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== "object" && typeof target !== "function") {
            target = {};
        }
        // Extend jQuery itself if only one argument is passed
        if (i === length) {
            target = this;
            i--;
        }
        for (; i < length; i++) {
            // Only deal with non-null/undefined values
            if ((options = arguments[i]) != null) {
                // Extend the base object
                for (name in options) {
                    copy = options[name];
                    // Prevent Object.prototype pollution
                    // Prevent never-ending loop
                    if (name === "__proto__" || target === copy) {
                        continue;
                    }
                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (jQuery.isPlainObject(copy) ||
                        (copyIsArray = Array.isArray(copy)))) {
                        src = target[name];
                        // Ensure proper type for the source value
                        if (copyIsArray && !Array.isArray(src)) {
                            clone = [];
                        }
                        else if (!copyIsArray && !jQuery.isPlainObject(src)) {
                            clone = {};
                        }
                        else {
                            clone = src;
                        }
                        copyIsArray = false;
                        // Never move original objects, clone them
                        target[name] = jQuery.extend(deep, clone, copy);
                        // Don't bring in undefined values
                    }
                    else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        // Return the modified object
        return target;
    };
    jQuery.extend({
        // Unique for each copy of jQuery on the page
        expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),
        // Assume jQuery is ready without the ready module
        isReady: true,
        error: function (msg) {
            throw new Error(msg);
        },
        noop: function () { },
        isPlainObject: function (obj) {
            var proto, Ctor;
            // Detect obvious negatives
            // Use toString instead of jQuery.type to catch host objects
            if (!obj || toString.call(obj) !== "[object Object]") {
                return false;
            }
            proto = getProto(obj);
            // Objects with no prototype (e.g., `Object.create( null )`) are plain
            if (!proto) {
                return true;
            }
            // Objects with prototype are plain iff they were constructed by a global Object function
            Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
            return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
        },
        isEmptyObject: function (obj) {
            var name;
            for (name in obj) {
                return false;
            }
            return true;
        },
        // Evaluates a script in a provided context; falls back to the global one
        // if not specified.
        globalEval: function (code, options, doc) {
            DOMEval(code, { nonce: options && options.nonce }, doc);
        },
        each: function (obj, callback) {
            var length, i = 0;
            if (isArrayLike(obj)) {
                length = obj.length;
                for (; i < length; i++) {
                    if (callback.call(obj[i], i, obj[i]) === false) {
                        break;
                    }
                }
            }
            else {
                for (i in obj) {
                    if (callback.call(obj[i], i, obj[i]) === false) {
                        break;
                    }
                }
            }
            return obj;
        },
        // Retrieve the text value of an array of DOM nodes
        text: function (elem) {
            var node, ret = "", i = 0, nodeType = elem.nodeType;
            if (!nodeType) {
                // If no nodeType, this is expected to be an array
                while ((node = elem[i++])) {
                    // Do not traverse comment nodes
                    ret += jQuery.text(node);
                }
            }
            if (nodeType === 1 || nodeType === 11) {
                return elem.textContent;
            }
            if (nodeType === 9) {
                return elem.documentElement.textContent;
            }
            if (nodeType === 3 || nodeType === 4) {
                return elem.nodeValue;
            }
            // Do not include comment or processing instruction nodes
            return ret;
        },
        // results is for internal usage only
        makeArray: function (arr, results) {
            var ret = results || [];
            if (arr != null) {
                if (isArrayLike(Object(arr))) {
                    jQuery.merge(ret, typeof arr === "string" ?
                        [arr] : arr);
                }
                else {
                    push.call(ret, arr);
                }
            }
            return ret;
        },
        inArray: function (elem, arr, i) {
            return arr == null ? -1 : indexOf.call(arr, elem, i);
        },
        isXMLDoc: function (elem) {
            var namespace = elem && elem.namespaceURI, docElem = elem && (elem.ownerDocument || elem).documentElement;
            // Assume HTML when documentElement doesn't yet exist, such as inside
            // document fragments.
            return !rhtmlSuffix.test(namespace || docElem && docElem.nodeName || "HTML");
        },
        // Note: an element does not contain itself
        contains: function (a, b) {
            var bup = b && b.parentNode;
            return a === bup || !!(bup && bup.nodeType === 1 && (
            // Support: IE 9 - 11+
            // IE doesn't have `contains` on SVG.
            a.contains ?
                a.contains(bup) :
                a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
        },
        merge: function (first, second) {
            var len = +second.length, j = 0, i = first.length;
            for (; j < len; j++) {
                first[i++] = second[j];
            }
            first.length = i;
            return first;
        },
        grep: function (elems, callback, invert) {
            var callbackInverse, matches = [], i = 0, length = elems.length, callbackExpect = !invert;
            // Go through the array, only saving the items
            // that pass the validator function
            for (; i < length; i++) {
                callbackInverse = !callback(elems[i], i);
                if (callbackInverse !== callbackExpect) {
                    matches.push(elems[i]);
                }
            }
            return matches;
        },
        // arg is for internal usage only
        map: function (elems, callback, arg) {
            var length, value, i = 0, ret = [];
            // Go through the array, translating each of the items to their new values
            if (isArrayLike(elems)) {
                length = elems.length;
                for (; i < length; i++) {
                    value = callback(elems[i], i, arg);
                    if (value != null) {
                        ret.push(value);
                    }
                }
                // Go through every key on the object,
            }
            else {
                for (i in elems) {
                    value = callback(elems[i], i, arg);
                    if (value != null) {
                        ret.push(value);
                    }
                }
            }
            // Flatten any nested arrays
            return flat(ret);
        },
        // A global GUID counter for objects
        guid: 1,
        // jQuery.support is not used in Core but other projects attach their
        // properties to it so it needs to exist.
        support: support
    });
    if (typeof Symbol === "function") {
        jQuery.fn[Symbol.iterator] = arr[Symbol.iterator];
    }
    // Populate the class2type map
    jQuery.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function (_i, name) {
        class2type["[object " + name + "]"] = name.toLowerCase();
    });
    function nodeName(elem, name) {
        return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
    }
    var pop = arr.pop;
    // https://www.w3.org/TR/css3-selectors/#whitespace
    var whitespace = "[\\x20\\t\\r\\n\\f]";
    var isIE = document.documentMode;
    // Support: Chrome 105 - 111 only, Safari 15.4 - 16.3 only
    // Make sure the `:has()` argument is parsed unforgivingly.
    // We include `*` in the test to detect buggy implementations that are
    // _selectively_ forgiving (specifically when the list includes at least
    // one valid selector).
    // Note that we treat complete lack of support for `:has()` as if it were
    // spec-compliant support, which is fine because use of `:has()` in such
    // environments will fail in the qSA path and fall back to jQuery traversal
    // anyway.
    try {
        document.querySelector(":has(*,:jqfake)");
        support.cssHas = false;
    }
    catch (e) {
        support.cssHas = true;
    }
    // Build QSA regex.
    // Regex strategy adopted from Diego Perini.
    var rbuggyQSA = [];
    if (isIE) {
        rbuggyQSA.push(
        // Support: IE 9 - 11+
        // IE's :disabled selector does not pick up the children of disabled fieldsets
        ":enabled", ":disabled", 
        // Support: IE 11+
        // IE 11 doesn't find elements on a `[name='']` query in some cases.
        // Adding a temporary attribute to the document before the selection works
        // around the issue.
        "\\[" + whitespace + "*name" + whitespace + "*=" +
            whitespace + "*(?:''|\"\")");
    }
    if (!support.cssHas) {
        // Support: Chrome 105 - 110+, Safari 15.4 - 16.3+
        // Our regular `try-catch` mechanism fails to detect natively-unsupported
        // pseudo-classes inside `:has()` (such as `:has(:contains("Foo"))`)
        // in browsers that parse the `:has()` argument as a forgiving selector list.
        // https://drafts.csswg.org/selectors/#relational now requires the argument
        // to be parsed unforgivingly, but browsers have not yet fully adjusted.
        rbuggyQSA.push(":has");
    }
    rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
    var rtrimCSS = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g");
    // https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
    var identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace +
        "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+";
    var booleans = "checked|selected|async|autofocus|autoplay|controls|" +
        "defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped";
    var rleadingCombinator = new RegExp("^" + whitespace + "*([>+~]|" +
        whitespace + ")" + whitespace + "*");
    var rsibling = /[+~]/;
    var documentElement = document.documentElement;
    // Support: IE 9 - 11+
    // IE requires a prefix.
    var matches = documentElement.matches || documentElement.msMatchesSelector;
    /**
     * Create key-value caches of limited size
     * @returns {function(string, object)} Returns the Object data after storing it on itself with
     *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
     *	deleting the oldest entry
     */
    function createCache() {
        var keys = [];
        function cache(key, value) {
            // Use (key + " ") to avoid collision with native prototype properties
            // (see https://github.com/jquery/sizzle/issues/157)
            if (keys.push(key + " ") > jQuery.expr.cacheLength) {
                // Only keep the most recent entries
                delete cache[keys.shift()];
            }
            return (cache[key + " "] = value);
        }
        return cache;
    }
    /**
     * Checks a node for validity as a jQuery selector context
     * @param {Element|Object=} context
     * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
     */
    function testContext(context) {
        return context && typeof context.getElementsByTagName !== "undefined" && context;
    }
    // Attribute selectors: https://www.w3.org/TR/selectors/#attribute-selectors
    var attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
        // Operator (capture 2)
        "*([*^$|!~]?=)" + whitespace +
        // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
        "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" +
        whitespace + "*\\]";
    var pseudos = ":(" + identifier + ")(?:\\((" +
        // To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
        // 1. quoted (capture 3; capture 4 or capture 5)
        "('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
        // 2. simple (capture 6)
        "((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
        // 3. anything else (capture 2)
        ".*" +
        ")\\)|)";
    var filterMatchExpr = {
        ID: new RegExp("^#(" + identifier + ")"),
        CLASS: new RegExp("^\\.(" + identifier + ")"),
        TAG: new RegExp("^(" + identifier + "|[*])"),
        ATTR: new RegExp("^" + attributes),
        PSEUDO: new RegExp("^" + pseudos),
        CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
            whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" +
            whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i")
    };
    var rpseudo = new RegExp(pseudos);
    // CSS escapes
    var runescape = new RegExp("\\\\[\\da-fA-F]{1,6}" + whitespace +
        "?|\\\\([^\\r\\n\\f])", "g"), funescape = function (escape, nonHex) {
        var high = "0x" + escape.slice(1) - 0x10000;
        if (nonHex) {
            // Strip the backslash prefix from a non-hex escape sequence
            return nonHex;
        }
        // Replace a hexadecimal escape sequence with the encoded Unicode code point
        // Support: IE <=11+
        // For values outside the Basic Multilingual Plane (BMP), manually construct a
        // surrogate pair
        return high < 0 ?
            String.fromCharCode(high + 0x10000) :
            String.fromCharCode(high >> 10 | 0xD800, high & 0x3FF | 0xDC00);
    };
    function unescapeSelector(sel) {
        return sel.replace(runescape, funescape);
    }
    function selectorError(msg) {
        jQuery.error("Syntax error, unrecognized expression: " + msg);
    }
    var rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*");
    var tokenCache = createCache();
    function tokenize(selector, parseOnly) {
        var matched, match, tokens, type, soFar, groups, preFilters, cached = tokenCache[selector + " "];
        if (cached) {
            return parseOnly ? 0 : cached.slice(0);
        }
        soFar = selector;
        groups = [];
        preFilters = jQuery.expr.preFilter;
        while (soFar) {
            // Comma and first run
            if (!matched || (match = rcomma.exec(soFar))) {
                if (match) {
                    // Don't consume trailing commas as valid
                    soFar = soFar.slice(match[0].length) || soFar;
                }
                groups.push((tokens = []));
            }
            matched = false;
            // Combinators
            if ((match = rleadingCombinator.exec(soFar))) {
                matched = match.shift();
                tokens.push({
                    value: matched,
                    // Cast descendant combinators to space
                    type: match[0].replace(rtrimCSS, " ")
                });
                soFar = soFar.slice(matched.length);
            }
            // Filters
            for (type in filterMatchExpr) {
                if ((match = jQuery.expr.match[type].exec(soFar)) && (!preFilters[type] ||
                    (match = preFilters[type](match)))) {
                    matched = match.shift();
                    tokens.push({
                        value: matched,
                        type: type,
                        matches: match
                    });
                    soFar = soFar.slice(matched.length);
                }
            }
            if (!matched) {
                break;
            }
        }
        // Return the length of the invalid excess
        // if we're just parsing
        // Otherwise, throw an error or return tokens
        if (parseOnly) {
            return soFar.length;
        }
        return soFar ?
            selectorError(selector) :
            // Cache the tokens
            tokenCache(selector, groups).slice(0);
    }
    var preFilter = {
        ATTR: function (match) {
            match[1] = unescapeSelector(match[1]);
            // Move the given value to match[3] whether quoted or unquoted
            match[3] = unescapeSelector(match[3] || match[4] || match[5] || "");
            if (match[2] === "~=") {
                match[3] = " " + match[3] + " ";
            }
            return match.slice(0, 4);
        },
        CHILD: function (match) {
            /* matches from filterMatchExpr["CHILD"]
                1 type (only|nth|...)
                2 what (child|of-type)
                3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
                4 xn-component of xn+y argument ([+-]?\d*n|)
                5 sign of xn-component
                6 x of xn-component
                7 sign of y-component
                8 y of y-component
            */
            match[1] = match[1].toLowerCase();
            if (match[1].slice(0, 3) === "nth") {
                // nth-* requires argument
                if (!match[3]) {
                    selectorError(match[0]);
                }
                // numeric x and y parameters for jQuery.expr.filter.CHILD
                // remember that false/true cast respectively to 0/1
                match[4] = +(match[4] ?
                    match[5] + (match[6] || 1) :
                    2 * (match[3] === "even" || match[3] === "odd"));
                match[5] = +((match[7] + match[8]) || match[3] === "odd");
                // other types prohibit arguments
            }
            else if (match[3]) {
                selectorError(match[0]);
            }
            return match;
        },
        PSEUDO: function (match) {
            var excess, unquoted = !match[6] && match[2];
            if (filterMatchExpr.CHILD.test(match[0])) {
                return null;
            }
            // Accept quoted arguments as-is
            if (match[3]) {
                match[2] = match[4] || match[5] || "";
                // Strip excess characters from unquoted arguments
            }
            else if (unquoted && rpseudo.test(unquoted) &&
                // Get excess from tokenize (recursively)
                (excess = tokenize(unquoted, true)) &&
                // advance to the next closing parenthesis
                (excess = unquoted.indexOf(")", unquoted.length - excess) -
                    unquoted.length)) {
                // excess is a negative index
                match[0] = match[0].slice(0, excess);
                match[2] = unquoted.slice(0, excess);
            }
            // Return only captures needed by the pseudo filter method (type and argument)
            return match.slice(0, 3);
        }
    };
    function toSelector(tokens) {
        var i = 0, len = tokens.length, selector = "";
        for (; i < len; i++) {
            selector += tokens[i].value;
        }
        return selector;
    }
    // CSS string/identifier serialization
    // https://drafts.csswg.org/cssom/#common-serializing-idioms
    var rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;
    function fcssescape(ch, asCodePoint) {
        if (asCodePoint) {
            // U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
            if (ch === "\0") {
                return "\uFFFD";
            }
            // Control characters and (dependent upon position) numbers get escaped as code points
            return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";
        }
        // Other potentially-special ASCII characters get backslash-escaped
        return "\\" + ch;
    }
    jQuery.escapeSelector = function (sel) {
        return (sel + "").replace(rcssescape, fcssescape);
    };
    var sort = arr.sort;
    var splice = arr.splice;
    var hasDuplicate;
    // Document order sorting
    function sortOrder(a, b) {
        // Flag for duplicate removal
        if (a === b) {
            hasDuplicate = true;
            return 0;
        }
        // Sort on method existence if only one input has compareDocumentPosition
        var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
        if (compare) {
            return compare;
        }
        // Calculate position if both inputs belong to the same document
        // Support: IE 11+
        // IE sometimes throws a "Permission denied" error when strict-comparing
        // two documents; shallow comparisons work.
        // eslint-disable-next-line eqeqeq
        compare = (a.ownerDocument || a) == (b.ownerDocument || b) ?
            a.compareDocumentPosition(b) :
            // Otherwise we know they are disconnected
            1;
        // Disconnected nodes
        if (compare & 1) {
            // Choose the first element that is related to the document
            // Support: IE 11+
            // IE sometimes throws a "Permission denied" error when strict-comparing
            // two documents; shallow comparisons work.
            // eslint-disable-next-line eqeqeq
            if (a == document || a.ownerDocument == document &&
                jQuery.contains(document, a)) {
                return -1;
            }
            // Support: IE 11+
            // IE sometimes throws a "Permission denied" error when strict-comparing
            // two documents; shallow comparisons work.
            // eslint-disable-next-line eqeqeq
            if (b == document || b.ownerDocument == document &&
                jQuery.contains(document, b)) {
                return 1;
            }
            // Maintain original order
            return 0;
        }
        return compare & 4 ? -1 : 1;
    }
    /**
     * Document sorting and removing duplicates
     * @param {ArrayLike} results
     */
    jQuery.uniqueSort = function (results) {
        var elem, duplicates = [], j = 0, i = 0;
        hasDuplicate = false;
        sort.call(results, sortOrder);
        if (hasDuplicate) {
            while ((elem = results[i++])) {
                if (elem === results[i]) {
                    j = duplicates.push(i);
                }
            }
            while (j--) {
                splice.call(results, duplicates[j], 1);
            }
        }
        return results;
    };
    jQuery.fn.uniqueSort = function () {
        return this.pushStack(jQuery.uniqueSort(slice.apply(this)));
    };
    var i, outermostContext, 
    // Local document vars
    document$1, documentElement$1, documentIsHTML, 
    // Instance-specific data
    dirruns = 0, done = 0, classCache = createCache(), compilerCache = createCache(), nonnativeSelectorCache = createCache(), 
    // Regular expressions
    // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
    rwhitespace = new RegExp(whitespace + "+", "g"), ridentifier = new RegExp("^" + identifier + "$"), matchExpr = jQuery.extend({
        bool: new RegExp("^(?:" + booleans + ")$", "i"),
        // For use in libraries implementing .is()
        // We use this for POS matching in `select`
        needsContext: new RegExp("^" + whitespace +
            "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
            "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
    }, filterMatchExpr), rinputs = /^(?:input|select|textarea|button)$/i, rheader = /^h\d$/i, 
    // Used for iframes; see `setDocument`.
    // Support: IE 9 - 11+
    // Removing the function wrapper causes a "Permission Denied"
    // error in IE.
    unloadHandler = function () {
        setDocument();
    }, inDisabledFieldset = addCombinator(function (elem) {
        return elem.disabled === true && nodeName(elem, "fieldset");
    }, { dir: "parentNode", next: "legend" });
    function find(selector, context, results, seed) {
        context && context.ownerDocument; 
        var // nodeType defaults to 9, since context defaults to document
        nodeType = context ? context.nodeType : 9;
        results = results || [];
        // Return early from calls with invalid selector or context
        if (typeof selector !== "string" || !selector ||
            nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {
            return results;
        }
        // All others
        return select(selector.replace(rtrimCSS, "$1"), context, results, seed);
    }
    /**
     * Mark a function for special use by jQuery selector module
     * @param {Function} fn The function to mark
     */
    function markFunction(fn) {
        fn[jQuery.expando] = true;
        return fn;
    }
    /**
     * Returns a function to use in pseudos for input types
     * @param {String} type
     */
    function createInputPseudo(type) {
        return function (elem) {
            return nodeName(elem, "input") && elem.type === type;
        };
    }
    /**
     * Returns a function to use in pseudos for buttons
     * @param {String} type
     */
    function createButtonPseudo(type) {
        return function (elem) {
            return (nodeName(elem, "input") || nodeName(elem, "button")) &&
                elem.type === type;
        };
    }
    /**
     * Returns a function to use in pseudos for :enabled/:disabled
     * @param {Boolean} disabled true for :disabled; false for :enabled
     */
    function createDisabledPseudo(disabled) {
        // Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
        return function (elem) {
            // Only certain elements can match :enabled or :disabled
            // https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
            // https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
            if ("form" in elem) {
                // Check for inherited disabledness on relevant non-disabled elements:
                // * listed form-associated elements in a disabled fieldset
                //   https://html.spec.whatwg.org/multipage/forms.html#category-listed
                //   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
                // * option elements in a disabled optgroup
                //   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
                // All such elements have a "form" property.
                if (elem.parentNode && elem.disabled === false) {
                    // Option elements defer to a parent optgroup if present
                    if ("label" in elem) {
                        if ("label" in elem.parentNode) {
                            return elem.parentNode.disabled === disabled;
                        }
                        else {
                            return elem.disabled === disabled;
                        }
                    }
                    // Support: IE 6 - 11+
                    // Use the isDisabled shortcut property to check for disabled fieldset ancestors
                    return elem.isDisabled === disabled ||
                        // Where there is no isDisabled, check manually
                        elem.isDisabled !== !disabled &&
                            inDisabledFieldset(elem) === disabled;
                }
                return elem.disabled === disabled;
                // Try to winnow out elements that can't be disabled before trusting the disabled property.
                // Some victims get caught in our net (label, legend, menu, track), but it shouldn't
                // even exist on them, let alone have a boolean value.
            }
            else if ("label" in elem) {
                return elem.disabled === disabled;
            }
            // Remaining elements are neither :enabled nor :disabled
            return false;
        };
    }
    /**
     * Returns a function to use in pseudos for positionals
     * @param {Function} fn
     */
    function createPositionalPseudo(fn) {
        return markFunction(function (argument) {
            argument = +argument;
            return markFunction(function (seed, matches) {
                var j, matchIndexes = fn([], seed.length, argument), i = matchIndexes.length;
                // Match elements found at the specified indexes
                while (i--) {
                    if (seed[(j = matchIndexes[i])]) {
                        seed[j] = !(matches[j] = seed[j]);
                    }
                }
            });
        });
    }
    /**
     * Sets document-related variables once based on the current document
     * @param {Element|Object} [node] An element or document object to use to set the document
     */
    function setDocument(node) {
        var subWindow, doc = node ? node.ownerDocument || node : document;
        // Return early if doc is invalid or already selected
        // Support: IE 11+
        // IE sometimes throws a "Permission denied" error when strict-comparing
        // two documents; shallow comparisons work.
        // eslint-disable-next-line eqeqeq
        if (doc == document$1 || doc.nodeType !== 9) {
            return;
        }
        // Update global variables
        document$1 = doc;
        documentElement$1 = document$1.documentElement;
        documentIsHTML = !jQuery.isXMLDoc(document$1);
        // Support: IE 9 - 11+
        // Accessing iframe documents after unload throws "permission denied" errors (see trac-13936)
        // Support: IE 11+
        // IE sometimes throws a "Permission denied" error when strict-comparing
        // two documents; shallow comparisons work.
        // eslint-disable-next-line eqeqeq
        if (isIE && document != document$1 &&
            (subWindow = document$1.defaultView) && subWindow.top !== subWindow) {
            subWindow.addEventListener("unload", unloadHandler);
        }
    }
    find.matches = function (expr, elements) {
        return find(expr, null, null, elements);
    };
    find.matchesSelector = function (elem, expr) {
        setDocument(elem);
        if (documentIsHTML &&
            !nonnativeSelectorCache[expr + " "] &&
            (!rbuggyQSA || !rbuggyQSA.test(expr))) {
            try {
                return matches.call(elem, expr);
            }
            catch (e) {
                nonnativeSelectorCache(expr, true);
            }
        }
        return find(expr, document$1, null, [elem]).length > 0;
    };
    jQuery.expr = {
        // Can be adjusted by the user
        cacheLength: 50,
        createPseudo: markFunction,
        match: matchExpr,
        find: {
            ID: function (id, context) {
                if (typeof context.getElementById !== "undefined" && documentIsHTML) {
                    var elem = context.getElementById(id);
                    return elem ? [elem] : [];
                }
            },
            TAG: function (tag, context) {
                if (typeof context.getElementsByTagName !== "undefined") {
                    return context.getElementsByTagName(tag);
                    // DocumentFragment nodes don't have gEBTN
                }
                else {
                    return context.querySelectorAll(tag);
                }
            },
            CLASS: function (className, context) {
                if (typeof context.getElementsByClassName !== "undefined" && documentIsHTML) {
                    return context.getElementsByClassName(className);
                }
            }
        },
        relative: {
            ">": { dir: "parentNode", first: true },
            " ": { dir: "parentNode" },
            "+": { dir: "previousSibling", first: true },
            "~": { dir: "previousSibling" }
        },
        preFilter: preFilter,
        filter: {
            ID: function (id) {
                var attrId = unescapeSelector(id);
                return function (elem) {
                    return elem.getAttribute("id") === attrId;
                };
            },
            TAG: function (nodeNameSelector) {
                var expectedNodeName = unescapeSelector(nodeNameSelector).toLowerCase();
                return nodeNameSelector === "*" ?
                    function () {
                        return true;
                    } :
                    function (elem) {
                        return nodeName(elem, expectedNodeName);
                    };
            },
            CLASS: function (className) {
                var pattern = classCache[className + " "];
                return pattern ||
                    (pattern = new RegExp("(^|" + whitespace + ")" + className +
                        "(" + whitespace + "|$)")) &&
                        classCache(className, function (elem) {
                            return pattern.test(typeof elem.className === "string" && elem.className ||
                                typeof elem.getAttribute !== "undefined" &&
                                    elem.getAttribute("class") ||
                                "");
                        });
            },
            ATTR: function (name, operator, check) {
                return function (elem) {
                    var result = elem.getAttribute(name);
                    if (result == null) {
                        return operator === "!=";
                    }
                    if (!operator) {
                        return true;
                    }
                    result += "";
                    if (operator === "=") {
                        return result === check;
                    }
                    if (operator === "!=") {
                        return result !== check;
                    }
                    if (operator === "^=") {
                        return check && result.indexOf(check) === 0;
                    }
                    if (operator === "*=") {
                        return check && result.indexOf(check) > -1;
                    }
                    if (operator === "$=") {
                        return check && result.slice(-check.length) === check;
                    }
                    if (operator === "~=") {
                        return (" " + result.replace(rwhitespace, " ") + " ")
                            .indexOf(check) > -1;
                    }
                    if (operator === "|=") {
                        return result === check || result.slice(0, check.length + 1) === check + "-";
                    }
                    return false;
                };
            },
            CHILD: function (type, what, _argument, first, last) {
                var simple = type.slice(0, 3) !== "nth", forward = type.slice(-4) !== "last", ofType = what === "of-type";
                return first === 1 && last === 0 ?
                    // Shortcut for :nth-*(n)
                    function (elem) {
                        return !!elem.parentNode;
                    } :
                    function (elem, _context, xml) {
                        var cache, outerCache, node, nodeIndex, start, dir = simple !== forward ? "nextSibling" : "previousSibling", parent = elem.parentNode, name = ofType && elem.nodeName.toLowerCase(), useCache = !xml && !ofType, diff = false;
                        if (parent) {
                            // :(first|last|only)-(child|of-type)
                            if (simple) {
                                while (dir) {
                                    node = elem;
                                    while ((node = node[dir])) {
                                        if (ofType ?
                                            nodeName(node, name) :
                                            node.nodeType === 1) {
                                            return false;
                                        }
                                    }
                                    // Reverse direction for :only-* (if we haven't yet done so)
                                    start = dir = type === "only" && !start && "nextSibling";
                                }
                                return true;
                            }
                            start = [forward ? parent.firstChild : parent.lastChild];
                            // non-xml :nth-child(...) stores cache data on `parent`
                            if (forward && useCache) {
                                // Seek `elem` from a previously-cached index
                                outerCache = parent[jQuery.expando] ||
                                    (parent[jQuery.expando] = {});
                                cache = outerCache[type] || [];
                                nodeIndex = cache[0] === dirruns && cache[1];
                                diff = nodeIndex && cache[2];
                                node = nodeIndex && parent.childNodes[nodeIndex];
                                while ((node = ++nodeIndex && node && node[dir] ||
                                    // Fallback to seeking `elem` from the start
                                    (diff = nodeIndex = 0) || start.pop())) {
                                    // When found, cache indexes on `parent` and break
                                    if (node.nodeType === 1 && ++diff && node === elem) {
                                        outerCache[type] = [dirruns, nodeIndex, diff];
                                        break;
                                    }
                                }
                            }
                            else {
                                // Use previously-cached element index if available
                                if (useCache) {
                                    outerCache = elem[jQuery.expando] ||
                                        (elem[jQuery.expando] = {});
                                    cache = outerCache[type] || [];
                                    nodeIndex = cache[0] === dirruns && cache[1];
                                    diff = nodeIndex;
                                }
                                // xml :nth-child(...)
                                // or :nth-last-child(...) or :nth(-last)?-of-type(...)
                                if (diff === false) {
                                    // Use the same loop as above to seek `elem` from the start
                                    while ((node = ++nodeIndex && node && node[dir] ||
                                        (diff = nodeIndex = 0) || start.pop())) {
                                        if ((ofType ?
                                            nodeName(node, name) :
                                            node.nodeType === 1) &&
                                            ++diff) {
                                            // Cache the index of each encountered element
                                            if (useCache) {
                                                outerCache = node[jQuery.expando] ||
                                                    (node[jQuery.expando] = {});
                                                outerCache[type] = [dirruns, diff];
                                            }
                                            if (node === elem) {
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                            // Incorporate the offset, then check against cycle size
                            diff -= last;
                            return diff === first || (diff % first === 0 && diff / first >= 0);
                        }
                    };
            },
            PSEUDO: function (pseudo, argument) {
                // pseudo-class names are case-insensitive
                // https://www.w3.org/TR/selectors/#pseudo-classes
                // Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
                // Remember that setFilters inherits from pseudos
                var fn = jQuery.expr.pseudos[pseudo] ||
                    jQuery.expr.setFilters[pseudo.toLowerCase()] ||
                    selectorError("unsupported pseudo: " + pseudo);
                // The user may use createPseudo to indicate that
                // arguments are needed to create the filter function
                // just as jQuery does
                if (fn[jQuery.expando]) {
                    return fn(argument);
                }
                return fn;
            }
        },
        pseudos: {
            // Potentially complex pseudos
            not: markFunction(function (selector) {
                // Trim the selector passed to compile
                // to avoid treating leading and trailing
                // spaces as combinators
                var input = [], results = [], matcher = compile(selector.replace(rtrimCSS, "$1"));
                return matcher[jQuery.expando] ?
                    markFunction(function (seed, matches, _context, xml) {
                        var elem, unmatched = matcher(seed, null, xml, []), i = seed.length;
                        // Match elements unmatched by `matcher`
                        while (i--) {
                            if ((elem = unmatched[i])) {
                                seed[i] = !(matches[i] = elem);
                            }
                        }
                    }) :
                    function (elem, _context, xml) {
                        input[0] = elem;
                        matcher(input, null, xml, results);
                        // Don't keep the element
                        // (see https://github.com/jquery/sizzle/issues/299)
                        input[0] = null;
                        return !results.pop();
                    };
            }),
            has: markFunction(function (selector) {
                return function (elem) {
                    return find(selector, elem).length > 0;
                };
            }),
            contains: markFunction(function (text) {
                text = unescapeSelector(text);
                return function (elem) {
                    return (elem.textContent || jQuery.text(elem)).indexOf(text) > -1;
                };
            }),
            // "Whether an element is represented by a :lang() selector
            // is based solely on the element's language value
            // being equal to the identifier C,
            // or beginning with the identifier C immediately followed by "-".
            // The matching of C against the element's language value is performed case-insensitively.
            // The identifier C does not have to be a valid language name."
            // https://www.w3.org/TR/selectors/#lang-pseudo
            lang: markFunction(function (lang) {
                // lang value must be a valid identifier
                if (!ridentifier.test(lang || "")) {
                    selectorError("unsupported lang: " + lang);
                }
                lang = unescapeSelector(lang).toLowerCase();
                return function (elem) {
                    var elemLang;
                    do {
                        if ((elemLang = documentIsHTML ?
                            elem.lang :
                            elem.getAttribute("xml:lang") || elem.getAttribute("lang"))) {
                            elemLang = elemLang.toLowerCase();
                            return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
                        }
                    } while ((elem = elem.parentNode) && elem.nodeType === 1);
                    return false;
                };
            }),
            // Miscellaneous
            target: function (elem) {
                var hash = window.location && window.location.hash;
                return hash && hash.slice(1) === elem.id;
            },
            root: function (elem) {
                return elem === documentElement$1;
            },
            focus: function (elem) {
                return elem === document$1.activeElement &&
                    document$1.hasFocus() &&
                    !!(elem.type || elem.href || ~elem.tabIndex);
            },
            // Boolean properties
            enabled: createDisabledPseudo(false),
            disabled: createDisabledPseudo(true),
            checked: function (elem) {
                // In CSS3, :checked should return both checked and selected elements
                // https://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                return (nodeName(elem, "input") && !!elem.checked) ||
                    (nodeName(elem, "option") && !!elem.selected);
            },
            selected: function (elem) {
                // Support: IE <=11+
                // Accessing the selectedIndex property
                // forces the browser to treat the default option as
                // selected when in an optgroup.
                if (isIE && elem.parentNode) {
                    // eslint-disable-next-line no-unused-expressions
                    elem.parentNode.selectedIndex;
                }
                return elem.selected === true;
            },
            // Contents
            empty: function (elem) {
                // https://www.w3.org/TR/selectors/#empty-pseudo
                // :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
                //   but not by others (comment: 8; processing instruction: 7; etc.)
                // nodeType < 6 works because attributes (2) do not appear as children
                for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                    if (elem.nodeType < 6) {
                        return false;
                    }
                }
                return true;
            },
            parent: function (elem) {
                return !jQuery.expr.pseudos.empty(elem);
            },
            // Element/input types
            header: function (elem) {
                return rheader.test(elem.nodeName);
            },
            input: function (elem) {
                return rinputs.test(elem.nodeName);
            },
            button: function (elem) {
                return nodeName(elem, "input") && elem.type === "button" ||
                    nodeName(elem, "button");
            },
            text: function (elem) {
                return nodeName(elem, "input") && elem.type === "text";
            },
            // Position-in-collection
            first: createPositionalPseudo(function () {
                return [0];
            }),
            last: createPositionalPseudo(function (_matchIndexes, length) {
                return [length - 1];
            }),
            eq: createPositionalPseudo(function (_matchIndexes, length, argument) {
                return [argument < 0 ? argument + length : argument];
            }),
            even: createPositionalPseudo(function (matchIndexes, length) {
                var i = 0;
                for (; i < length; i += 2) {
                    matchIndexes.push(i);
                }
                return matchIndexes;
            }),
            odd: createPositionalPseudo(function (matchIndexes, length) {
                var i = 1;
                for (; i < length; i += 2) {
                    matchIndexes.push(i);
                }
                return matchIndexes;
            }),
            lt: createPositionalPseudo(function (matchIndexes, length, argument) {
                var i;
                if (argument < 0) {
                    i = argument + length;
                }
                else if (argument > length) {
                    i = length;
                }
                else {
                    i = argument;
                }
                for (; --i >= 0;) {
                    matchIndexes.push(i);
                }
                return matchIndexes;
            }),
            gt: createPositionalPseudo(function (matchIndexes, length, argument) {
                var i = argument < 0 ? argument + length : argument;
                for (; ++i < length;) {
                    matchIndexes.push(i);
                }
                return matchIndexes;
            })
        }
    };
    jQuery.expr.pseudos.nth = jQuery.expr.pseudos.eq;
    // Add button/input type pseudos
    for (i in { radio: true, checkbox: true, file: true, password: true, image: true }) {
        jQuery.expr.pseudos[i] = createInputPseudo(i);
    }
    for (i in { submit: true, reset: true }) {
        jQuery.expr.pseudos[i] = createButtonPseudo(i);
    }
    // Easy API for creating new setFilters
    function setFilters() { }
    setFilters.prototype = jQuery.expr.filters = jQuery.expr.pseudos;
    jQuery.expr.setFilters = new setFilters();
    function addCombinator(matcher, combinator, base) {
        var dir = combinator.dir, skip = combinator.next, key = skip || dir, checkNonElements = base && key === "parentNode", doneName = done++;
        return combinator.first ?
            // Check against closest ancestor/preceding element
            function (elem, context, xml) {
                while ((elem = elem[dir])) {
                    if (elem.nodeType === 1 || checkNonElements) {
                        return matcher(elem, context, xml);
                    }
                }
                return false;
            } :
            // Check against all ancestor/preceding elements
            function (elem, context, xml) {
                var oldCache, outerCache, newCache = [dirruns, doneName];
                // We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
                if (xml) {
                    while ((elem = elem[dir])) {
                        if (elem.nodeType === 1 || checkNonElements) {
                            if (matcher(elem, context, xml)) {
                                return true;
                            }
                        }
                    }
                }
                else {
                    while ((elem = elem[dir])) {
                        if (elem.nodeType === 1 || checkNonElements) {
                            outerCache = elem[jQuery.expando] || (elem[jQuery.expando] = {});
                            if (skip && nodeName(elem, skip)) {
                                elem = elem[dir] || elem;
                            }
                            else if ((oldCache = outerCache[key]) &&
                                oldCache[0] === dirruns && oldCache[1] === doneName) {
                                // Assign to newCache so results back-propagate to previous elements
                                return (newCache[2] = oldCache[2]);
                            }
                            else {
                                // Reuse newcache so results back-propagate to previous elements
                                outerCache[key] = newCache;
                                // A match means we're done; a fail means we have to keep checking
                                if ((newCache[2] = matcher(elem, context, xml))) {
                                    return true;
                                }
                            }
                        }
                    }
                }
                return false;
            };
    }
    function elementMatcher(matchers) {
        return matchers.length > 1 ?
            function (elem, context, xml) {
                var i = matchers.length;
                while (i--) {
                    if (!matchers[i](elem, context, xml)) {
                        return false;
                    }
                }
                return true;
            } :
            matchers[0];
    }
    function multipleContexts(selector, contexts, results) {
        var i = 0, len = contexts.length;
        for (; i < len; i++) {
            find(selector, contexts[i], results);
        }
        return results;
    }
    function condense(unmatched, map, filter, context, xml) {
        var elem, newUnmatched = [], i = 0, len = unmatched.length, mapped = map != null;
        for (; i < len; i++) {
            if ((elem = unmatched[i])) {
                if (!filter || filter(elem, context, xml)) {
                    newUnmatched.push(elem);
                    if (mapped) {
                        map.push(i);
                    }
                }
            }
        }
        return newUnmatched;
    }
    function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
        if (postFilter && !postFilter[jQuery.expando]) {
            postFilter = setMatcher(postFilter);
        }
        if (postFinder && !postFinder[jQuery.expando]) {
            postFinder = setMatcher(postFinder, postSelector);
        }
        return markFunction(function (seed, results, context, xml) {
            var temp, i, elem, matcherOut, preMap = [], postMap = [], preexisting = results.length, 
            // Get initial elements from seed or context
            elems = seed ||
                multipleContexts(selector || "*", context.nodeType ? [context] : context, []), 
            // Prefilter to get matcher input, preserving a map for seed-results synchronization
            matcherIn = preFilter && (seed || !selector) ?
                condense(elems, preMap, preFilter, context, xml) :
                elems;
            if (matcher) {
                // If we have a postFinder, or filtered seed, or non-seed postFilter
                // or preexisting results,
                matcherOut = postFinder || (seed ? preFilter : preexisting || postFilter) ?
                    // ...intermediate processing is necessary
                    [] :
                    // ...otherwise use results directly
                    results;
                // Find primary matches
                matcher(matcherIn, matcherOut, context, xml);
            }
            else {
                matcherOut = matcherIn;
            }
            // Apply postFilter
            if (postFilter) {
                temp = condense(matcherOut, postMap);
                postFilter(temp, [], context, xml);
                // Un-match failing elements by moving them back to matcherIn
                i = temp.length;
                while (i--) {
                    if ((elem = temp[i])) {
                        matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
                    }
                }
            }
            if (seed) {
                if (postFinder || preFilter) {
                    if (postFinder) {
                        // Get the final matcherOut by condensing this intermediate into postFinder contexts
                        temp = [];
                        i = matcherOut.length;
                        while (i--) {
                            if ((elem = matcherOut[i])) {
                                // Restore matcherIn since elem is not yet a final match
                                temp.push((matcherIn[i] = elem));
                            }
                        }
                        postFinder(null, (matcherOut = []), temp, xml);
                    }
                    // Move matched elements from seed to results to keep them synchronized
                    i = matcherOut.length;
                    while (i--) {
                        if ((elem = matcherOut[i]) &&
                            (temp = postFinder ? indexOf.call(seed, elem) : preMap[i]) > -1) {
                            seed[temp] = !(results[temp] = elem);
                        }
                    }
                }
                // Add elements to results, through postFinder if defined
            }
            else {
                matcherOut = condense(matcherOut === results ?
                    matcherOut.splice(preexisting, matcherOut.length) :
                    matcherOut);
                if (postFinder) {
                    postFinder(null, results, matcherOut, xml);
                }
                else {
                    push.apply(results, matcherOut);
                }
            }
        });
    }
    function matcherFromTokens(tokens) {
        var checkContext, matcher, j, len = tokens.length, leadingRelative = jQuery.expr.relative[tokens[0].type], implicitRelative = leadingRelative || jQuery.expr.relative[" "], i = leadingRelative ? 1 : 0, 
        // The foundational matcher ensures that elements are reachable from top-level context(s)
        matchContext = addCombinator(function (elem) {
            return elem === checkContext;
        }, implicitRelative, true), matchAnyContext = addCombinator(function (elem) {
            return indexOf.call(checkContext, elem) > -1;
        }, implicitRelative, true), matchers = [function (elem, context, xml) {
                // Support: IE 11+
                // IE sometimes throws a "Permission denied" error when strict-comparing
                // two documents; shallow comparisons work.
                // eslint-disable-next-line eqeqeq
                var ret = (!leadingRelative && (xml || context != outermostContext)) || ((checkContext = context).nodeType ?
                    matchContext(elem, context, xml) :
                    matchAnyContext(elem, context, xml));
                // Avoid hanging onto element
                // (see https://github.com/jquery/sizzle/issues/299)
                checkContext = null;
                return ret;
            }];
        for (; i < len; i++) {
            if ((matcher = jQuery.expr.relative[tokens[i].type])) {
                matchers = [addCombinator(elementMatcher(matchers), matcher)];
            }
            else {
                matcher = jQuery.expr.filter[tokens[i].type].apply(null, tokens[i].matches);
                // Return special upon seeing a positional matcher
                if (matcher[jQuery.expando]) {
                    // Find the next relative operator (if any) for proper handling
                    j = ++i;
                    for (; j < len; j++) {
                        if (jQuery.expr.relative[tokens[j].type]) {
                            break;
                        }
                    }
                    return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && toSelector(
                    // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                    tokens.slice(0, i - 1)
                        .concat({ value: tokens[i - 2].type === " " ? "*" : "" })).replace(rtrimCSS, "$1"), matcher, i < j && matcherFromTokens(tokens.slice(i, j)), j < len && matcherFromTokens((tokens = tokens.slice(j))), j < len && toSelector(tokens));
                }
                matchers.push(matcher);
            }
        }
        return elementMatcher(matchers);
    }
    function matcherFromGroupMatchers(elementMatchers, setMatchers) {
        var bySet = setMatchers.length > 0, byElement = elementMatchers.length > 0, superMatcher = function (seed, context, xml, results, outermost) {
            var elem, j, matcher, matchedCount = 0, i = "0", unmatched = seed && [], setMatched = [], contextBackup = outermostContext, 
            // We must always have either seed elements or outermost context
            elems = seed || byElement && jQuery.expr.find.TAG("*", outermost), 
            // Use integer dirruns iff this is the outermost matcher
            dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);
            if (outermost) {
                // Support: IE 11+
                // IE sometimes throws a "Permission denied" error when strict-comparing
                // two documents; shallow comparisons work.
                // eslint-disable-next-line eqeqeq
                outermostContext = context == document$1 || context || outermost;
            }
            // Add elements passing elementMatchers directly to results
            for (; (elem = elems[i]) != null; i++) {
                if (byElement && elem) {
                    j = 0;
                    // Support: IE 11+
                    // IE sometimes throws a "Permission denied" error when strict-comparing
                    // two documents; shallow comparisons work.
                    // eslint-disable-next-line eqeqeq
                    if (!context && elem.ownerDocument != document$1) {
                        setDocument(elem);
                        xml = !documentIsHTML;
                    }
                    while ((matcher = elementMatchers[j++])) {
                        if (matcher(elem, context || document$1, xml)) {
                            push.call(results, elem);
                            break;
                        }
                    }
                    if (outermost) {
                        dirruns = dirrunsUnique;
                    }
                }
                // Track unmatched elements for set filters
                if (bySet) {
                    // They will have gone through all possible matchers
                    if ((elem = !matcher && elem)) {
                        matchedCount--;
                    }
                    // Lengthen the array for every element, matched or not
                    if (seed) {
                        unmatched.push(elem);
                    }
                }
            }
            // `i` is now the count of elements visited above, and adding it to `matchedCount`
            // makes the latter nonnegative.
            matchedCount += i;
            // Apply set filters to unmatched elements
            // NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
            // equals `i`), unless we didn't visit _any_ elements in the above loop because we have
            // no element matchers and no seed.
            // Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
            // case, which will result in a "00" `matchedCount` that differs from `i` but is also
            // numerically zero.
            if (bySet && i !== matchedCount) {
                j = 0;
                while ((matcher = setMatchers[j++])) {
                    matcher(unmatched, setMatched, context, xml);
                }
                if (seed) {
                    // Reintegrate element matches to eliminate the need for sorting
                    if (matchedCount > 0) {
                        while (i--) {
                            if (!(unmatched[i] || setMatched[i])) {
                                setMatched[i] = pop.call(results);
                            }
                        }
                    }
                    // Discard index placeholder values to get only actual matches
                    setMatched = condense(setMatched);
                }
                // Add matches to results
                push.apply(results, setMatched);
                // Seedless set matches succeeding multiple successful matchers stipulate sorting
                if (outermost && !seed && setMatched.length > 0 &&
                    (matchedCount + setMatchers.length) > 1) {
                    jQuery.uniqueSort(results);
                }
            }
            // Override manipulation of globals by nested matchers
            if (outermost) {
                dirruns = dirrunsUnique;
                outermostContext = contextBackup;
            }
            return unmatched;
        };
        return bySet ?
            markFunction(superMatcher) :
            superMatcher;
    }
    function compile(selector, match /* Internal Use Only */) {
        var i, setMatchers = [], elementMatchers = [], cached = compilerCache[selector + " "];
        if (!cached) {
            // Generate a function of recursive functions that can be used to check each element
            if (!match) {
                match = tokenize(selector);
            }
            i = match.length;
            while (i--) {
                cached = matcherFromTokens(match[i]);
                if (cached[jQuery.expando]) {
                    setMatchers.push(cached);
                }
                else {
                    elementMatchers.push(cached);
                }
            }
            // Cache the compiled function
            cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));
            // Save selector and tokenization
            cached.selector = selector;
        }
        return cached;
    }
    /**
     * A low-level selection function that works with jQuery's compiled
     *  selector functions
     * @param {String|Function} selector A selector or a pre-compiled
     *  selector function built with jQuery selector compile
     * @param {Element} context
     * @param {Array} [results]
     * @param {Array} [seed] A set of elements to match against
     */
    function select(selector, context, results, seed) {
        var i, tokens, token, type, find, compiled = typeof selector === "function" && selector, match = !seed && tokenize((selector = compiled.selector || selector));
        results = results || [];
        // Try to minimize operations if there is only one selector in the list and no seed
        // (the latter of which guarantees us context)
        if (match.length === 1) {
            // Reduce context if the leading compound selector is an ID
            tokens = match[0] = match[0].slice(0);
            if (tokens.length > 2 && (token = tokens[0]).type === "ID" &&
                context.nodeType === 9 && documentIsHTML &&
                jQuery.expr.relative[tokens[1].type]) {
                context = (jQuery.expr.find.ID(unescapeSelector(token.matches[0]), context) || [])[0];
                if (!context) {
                    return results;
                    // Precompiled matchers will still verify ancestry, so step up a level
                }
                else if (compiled) {
                    context = context.parentNode;
                }
                selector = selector.slice(tokens.shift().value.length);
            }
            // Fetch a seed set for right-to-left matching
            i = matchExpr.needsContext.test(selector) ? 0 : tokens.length;
            while (i--) {
                token = tokens[i];
                // Abort if we hit a combinator
                if (jQuery.expr.relative[(type = token.type)]) {
                    break;
                }
                if ((find = jQuery.expr.find[type])) {
                    // Search, expanding context for leading sibling combinators
                    if ((seed = find(unescapeSelector(token.matches[0]), rsibling.test(tokens[0].type) &&
                        testContext(context.parentNode) || context))) {
                        // If seed is empty or no tokens remain, we can return early
                        tokens.splice(i, 1);
                        selector = seed.length && toSelector(tokens);
                        if (!selector) {
                            push.apply(results, seed);
                            return results;
                        }
                        break;
                    }
                }
            }
        }
        // Compile and execute a filtering function if one is not provided
        // Provide `match` to avoid retokenization if we modified the selector above
        (compiled || compile(selector, match))(seed, context, !documentIsHTML, results, !context || rsibling.test(selector) && testContext(context.parentNode) || context);
        return results;
    }
    // Initialize against the default document
    setDocument();
    jQuery.find = find;
    // These have always been private, but they used to be documented as part of
    // Sizzle so let's maintain them for now for backwards compatibility purposes.
    find.compile = compile;
    find.select = select;
    find.setDocument = setDocument;
    find.tokenize = tokenize;
    return jQuery;
});

/**
 * Check whether an element of interest matches a given selector.
 *
 * @param selector the selector of interest
 * @param elm an element within which to find matching elements
 * @returns whether the element matches the selector
 */
function matches(selector, elm) {
    try {
        const r = jQuery.find(selector, undefined, undefined, [elm]);
        return r.length > 0;
    }
    catch (e) {
        updateSelectorError(selector, e);
        throw e;
    }
}
/**
 * Select the first element that matches a given selector
 *
 * @param selector the selector of interest
 * @param elm the element within which to find a matching element
 * @returns the first matching element, or null if none is found
 */
function selectOne(selector, elm) {
    try {
        const r = jQuery.find(selector, elm, undefined, undefined);
        return r[0] || null;
    }
    catch (e) {
        updateSelectorError(selector, e);
        throw e;
    }
}
/**
 * Select all elements that match a given selector
 *
 * @param selector the selector of interest
 * @param elm an element within which to find matching elements
 * @returns all matching elements
 */
function selectAll(selector, elm) {
    try {
        return jQuery.find(selector, elm, undefined, undefined);
    }
    catch (e) {
        updateSelectorError(selector, e);
        throw e;
    }
}
/**
 * A manifest of selectors which are known to be problematic in jQuery. See
 * here to track implementation and support:
 * https://github.com/jquery/jquery/issues/5111
 */
const PROBLEMATIC_SELECTORS = [':scope', ':where', ':is'];
/**
 * Given a selector and an error object thrown by jQuery, annotate the
 * error's message to add some context as to the probable reason for the error.
 * In particular, if the selector includes a selector which is known to be
 * unsupported in jQuery, then we know that was likely the cause of the
 * error.
 *
 * @param selector our selector of interest
 * @param e an error object that was thrown in the course of using jQuery
 */
function updateSelectorError(selector, e) {
    const selectorsPresent = PROBLEMATIC_SELECTORS.filter((s) => selector.includes(s));
    if (selectorsPresent.length > 0 && e.message) {
        e.message =
            `At present jQuery does not support the ${humanReadableList(selectorsPresent)} ${selectorsPresent.length === 1 ? 'selector' : 'selectors'}.
If you need this in your test, consider writing an end-to-end test instead.\n` + e.message;
    }
}
/**
 * Format a list of strings in a 'human readable' way.
 *
 * - If one string (['string']), return 'string'
 * - If two strings (['a', 'b']), return 'a and b'
 * - If three or more (['a', 'b', 'c']), return 'a, b and c'
 *
 * @param items a list of strings to format
 * @returns a formatted string
 */
function humanReadableList(items) {
    if (items.length <= 1) {
        return items.join('');
    }
    return `${items.slice(0, items.length - 1).join(', ')} and ${items[items.length - 1]}`;
}

function serializeNodeToHtml(elm, opts = {}) {
    const output = {
        currentLineWidth: 0,
        indent: 0,
        isWithinBody: false,
        text: [],
    };
    if (opts.prettyHtml) {
        if (typeof opts.indentSpaces !== 'number') {
            opts.indentSpaces = 2;
        }
        if (typeof opts.newLines !== 'boolean') {
            opts.newLines = true;
        }
        opts.approximateLineWidth = -1;
    }
    else {
        opts.prettyHtml = false;
        if (typeof opts.newLines !== 'boolean') {
            opts.newLines = false;
        }
        if (typeof opts.indentSpaces !== 'number') {
            opts.indentSpaces = 0;
        }
    }
    if (typeof opts.approximateLineWidth !== 'number') {
        opts.approximateLineWidth = -1;
    }
    if (typeof opts.removeEmptyAttributes !== 'boolean') {
        opts.removeEmptyAttributes = true;
    }
    if (typeof opts.removeAttributeQuotes !== 'boolean') {
        opts.removeAttributeQuotes = false;
    }
    if (typeof opts.removeBooleanAttributeQuotes !== 'boolean') {
        opts.removeBooleanAttributeQuotes = false;
    }
    if (typeof opts.removeHtmlComments !== 'boolean') {
        opts.removeHtmlComments = false;
    }
    if (typeof opts.serializeShadowRoot !== 'boolean') {
        opts.serializeShadowRoot = false;
    }
    if (opts.outerHtml) {
        serializeToHtml(elm, opts, output, false);
    }
    else {
        for (let i = 0, ii = elm.childNodes.length; i < ii; i++) {
            serializeToHtml(elm.childNodes[i], opts, output, false);
        }
    }
    if (output.text[0] === '\n') {
        output.text.shift();
    }
    if (output.text[output.text.length - 1] === '\n') {
        output.text.pop();
    }
    return output.text.join('');
}
function serializeToHtml(node, opts, output, isShadowRoot) {
    if (node.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */ || isShadowRoot) {
        const tagName = isShadowRoot ? 'mock:shadow-root' : getTagName(node);
        if (tagName === 'body') {
            output.isWithinBody = true;
        }
        const ignoreTag = opts.excludeTags != null && opts.excludeTags.includes(tagName);
        if (ignoreTag === false) {
            const isWithinWhitespaceSensitiveNode = opts.newLines || opts.indentSpaces > 0 ? isWithinWhitespaceSensitive(node) : false;
            if (opts.newLines && !isWithinWhitespaceSensitiveNode) {
                output.text.push('\n');
                output.currentLineWidth = 0;
            }
            if (opts.indentSpaces > 0 && !isWithinWhitespaceSensitiveNode) {
                for (let i = 0; i < output.indent; i++) {
                    output.text.push(' ');
                }
                output.currentLineWidth += output.indent;
            }
            output.text.push('<' + tagName);
            output.currentLineWidth += tagName.length + 1;
            const attrsLength = node.attributes.length;
            const attributes = opts.prettyHtml && attrsLength > 1
                ? cloneAttributes(node.attributes, true)
                : node.attributes;
            for (let i = 0; i < attrsLength; i++) {
                const attr = attributes.item(i);
                const attrName = attr.name;
                if (attrName === 'style') {
                    continue;
                }
                let attrValue = attr.value;
                if (opts.removeEmptyAttributes && attrValue === '' && REMOVE_EMPTY_ATTR.has(attrName)) {
                    continue;
                }
                const attrNamespaceURI = attr.namespaceURI;
                if (attrNamespaceURI == null) {
                    output.currentLineWidth += attrName.length + 1;
                    if (opts.approximateLineWidth > 0 && output.currentLineWidth > opts.approximateLineWidth) {
                        output.text.push('\n' + attrName);
                        output.currentLineWidth = 0;
                    }
                    else {
                        output.text.push(' ' + attrName);
                    }
                }
                else if (attrNamespaceURI === 'http://www.w3.org/XML/1998/namespace') {
                    output.text.push(' xml:' + attrName);
                    output.currentLineWidth += attrName.length + 5;
                }
                else if (attrNamespaceURI === 'http://www.w3.org/2000/xmlns/') {
                    if (attrName !== 'xmlns') {
                        output.text.push(' xmlns:' + attrName);
                        output.currentLineWidth += attrName.length + 7;
                    }
                    else {
                        output.text.push(' ' + attrName);
                        output.currentLineWidth += attrName.length + 1;
                    }
                }
                else if (attrNamespaceURI === XLINK_NS) {
                    output.text.push(' xlink:' + attrName);
                    output.currentLineWidth += attrName.length + 7;
                }
                else {
                    output.text.push(' ' + attrNamespaceURI + ':' + attrName);
                    output.currentLineWidth += attrNamespaceURI.length + attrName.length + 2;
                }
                if (opts.prettyHtml && attrName === 'class') {
                    attrValue = attr.value = attrValue
                        .split(' ')
                        .filter((t) => t !== '')
                        .sort()
                        .join(' ')
                        .trim();
                }
                if (attrValue === '') {
                    if (opts.removeBooleanAttributeQuotes && BOOLEAN_ATTR.has(attrName)) {
                        continue;
                    }
                    if (opts.removeEmptyAttributes && attrName.startsWith('data-')) {
                        continue;
                    }
                }
                if (opts.removeAttributeQuotes && CAN_REMOVE_ATTR_QUOTES.test(attrValue)) {
                    output.text.push('=' + escapeString(attrValue, true));
                    output.currentLineWidth += attrValue.length + 1;
                }
                else {
                    output.text.push('="' + escapeString(attrValue, true) + '"');
                    output.currentLineWidth += attrValue.length + 3;
                }
            }
            if (node.hasAttribute('style')) {
                const cssText = node.style.cssText;
                if (opts.approximateLineWidth > 0 &&
                    output.currentLineWidth + cssText.length + 10 > opts.approximateLineWidth) {
                    output.text.push(`\nstyle="${cssText}">`);
                    output.currentLineWidth = 0;
                }
                else {
                    output.text.push(` style="${cssText}">`);
                    output.currentLineWidth += cssText.length + 10;
                }
            }
            else {
                output.text.push('>');
                output.currentLineWidth += 1;
            }
        }
        if (EMPTY_ELEMENTS.has(tagName) === false) {
            if (opts.serializeShadowRoot && node.shadowRoot != null) {
                output.indent = output.indent + opts.indentSpaces;
                serializeToHtml(node.shadowRoot, opts, output, true);
                output.indent = output.indent - opts.indentSpaces;
                if (opts.newLines &&
                    (node.childNodes.length === 0 ||
                        (node.childNodes.length === 1 &&
                            node.childNodes[0].nodeType === 3 /* NODE_TYPES.TEXT_NODE */ &&
                            node.childNodes[0].nodeValue.trim() === ''))) {
                    output.text.push('\n');
                    output.currentLineWidth = 0;
                    for (let i = 0; i < output.indent; i++) {
                        output.text.push(' ');
                    }
                    output.currentLineWidth += output.indent;
                }
            }
            if (opts.excludeTagContent == null || opts.excludeTagContent.includes(tagName) === false) {
                const childNodes = tagName === 'template' ? node.content.childNodes : node.childNodes;
                const childNodeLength = childNodes.length;
                if (childNodeLength > 0) {
                    if (childNodeLength === 1 &&
                        childNodes[0].nodeType === 3 /* NODE_TYPES.TEXT_NODE */ &&
                        (typeof childNodes[0].nodeValue !== 'string' || childNodes[0].nodeValue.trim() === '')) ;
                    else {
                        const isWithinWhitespaceSensitiveNode = opts.newLines || opts.indentSpaces > 0 ? isWithinWhitespaceSensitive(node) : false;
                        if (!isWithinWhitespaceSensitiveNode && opts.indentSpaces > 0 && ignoreTag === false) {
                            output.indent = output.indent + opts.indentSpaces;
                        }
                        for (let i = 0; i < childNodeLength; i++) {
                            serializeToHtml(childNodes[i], opts, output, false);
                        }
                        if (ignoreTag === false) {
                            if (opts.newLines && !isWithinWhitespaceSensitiveNode) {
                                output.text.push('\n');
                                output.currentLineWidth = 0;
                            }
                            if (opts.indentSpaces > 0 && !isWithinWhitespaceSensitiveNode) {
                                output.indent = output.indent - opts.indentSpaces;
                                for (let i = 0; i < output.indent; i++) {
                                    output.text.push(' ');
                                }
                                output.currentLineWidth += output.indent;
                            }
                        }
                    }
                }
                if (ignoreTag === false) {
                    output.text.push('</' + tagName + '>');
                    output.currentLineWidth += tagName.length + 3;
                }
            }
        }
        if (opts.approximateLineWidth > 0 && STRUCTURE_ELEMENTS.has(tagName)) {
            output.text.push('\n');
            output.currentLineWidth = 0;
        }
        if (tagName === 'body') {
            output.isWithinBody = false;
        }
    }
    else if (node.nodeType === 3 /* NODE_TYPES.TEXT_NODE */) {
        let textContent = node.nodeValue;
        if (typeof textContent === 'string') {
            const trimmedTextContent = textContent.trim();
            if (trimmedTextContent === '') {
                // this text node is whitespace only
                if (isWithinWhitespaceSensitive(node)) {
                    // whitespace matters within this element
                    // just add the exact text we were given
                    output.text.push(textContent);
                    output.currentLineWidth += textContent.length;
                }
                else if (opts.approximateLineWidth > 0 && !output.isWithinBody) ;
                else if (!opts.prettyHtml) {
                    // this text node is only whitespace, and it's not
                    // within a whitespace sensitive element like <pre> or <code>
                    // so replace the entire white space with a single new line
                    output.currentLineWidth += 1;
                    if (opts.approximateLineWidth > 0 && output.currentLineWidth > opts.approximateLineWidth) {
                        // good enough for a new line
                        // for perf these are all just estimates
                        // we don't care to ensure exact line lengths
                        output.text.push('\n');
                        output.currentLineWidth = 0;
                    }
                    else {
                        // let's keep it all on the same line yet
                        output.text.push(' ');
                    }
                }
            }
            else {
                // this text node has text content
                const isWithinWhitespaceSensitiveNode = opts.newLines || opts.indentSpaces > 0 || opts.prettyHtml ? isWithinWhitespaceSensitive(node) : false;
                if (opts.newLines && !isWithinWhitespaceSensitiveNode) {
                    output.text.push('\n');
                    output.currentLineWidth = 0;
                }
                if (opts.indentSpaces > 0 && !isWithinWhitespaceSensitiveNode) {
                    for (let i = 0; i < output.indent; i++) {
                        output.text.push(' ');
                    }
                    output.currentLineWidth += output.indent;
                }
                let textContentLength = textContent.length;
                if (textContentLength > 0) {
                    // this text node has text content
                    const parentTagName = node.parentNode != null && node.parentNode.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */
                        ? node.parentNode.nodeName
                        : null;
                    if (NON_ESCAPABLE_CONTENT.has(parentTagName)) {
                        // this text node cannot have its content escaped since it's going
                        // into an element like <style> or <script>
                        if (isWithinWhitespaceSensitive(node)) {
                            output.text.push(textContent);
                        }
                        else {
                            output.text.push(trimmedTextContent);
                            textContentLength = trimmedTextContent.length;
                        }
                        output.currentLineWidth += textContentLength;
                    }
                    else {
                        // this text node is going into a normal element and html can be escaped
                        if (opts.prettyHtml && !isWithinWhitespaceSensitiveNode) {
                            // pretty print the text node
                            output.text.push(escapeString(textContent.replace(/\s\s+/g, ' ').trim(), false));
                            output.currentLineWidth += textContentLength;
                        }
                        else {
                            // not pretty printing the text node
                            if (isWithinWhitespaceSensitive(node)) {
                                output.currentLineWidth += textContentLength;
                            }
                            else {
                                // this element is not a whitespace sensitive one, like <pre> or <code> so
                                // any whitespace at the start and end can be cleaned up to just be one space
                                if (/\s/.test(textContent.charAt(0))) {
                                    textContent = ' ' + textContent.trimLeft();
                                }
                                textContentLength = textContent.length;
                                if (textContentLength > 1) {
                                    if (/\s/.test(textContent.charAt(textContentLength - 1))) {
                                        if (opts.approximateLineWidth > 0 &&
                                            output.currentLineWidth + textContentLength > opts.approximateLineWidth) {
                                            textContent = textContent.trimRight() + '\n';
                                            output.currentLineWidth = 0;
                                        }
                                        else {
                                            textContent = textContent.trimRight() + ' ';
                                        }
                                    }
                                }
                                output.currentLineWidth += textContentLength;
                            }
                            output.text.push(escapeString(textContent, false));
                        }
                    }
                }
            }
        }
    }
    else if (node.nodeType === 8 /* NODE_TYPES.COMMENT_NODE */) {
        const nodeValue = node.nodeValue;
        if (opts.removeHtmlComments) {
            const isHydrateAnnotation = nodeValue.startsWith(CONTENT_REF_ID + '.') ||
                nodeValue.startsWith(ORG_LOCATION_ID + '.') ||
                nodeValue.startsWith(SLOT_NODE_ID + '.') ||
                nodeValue.startsWith(TEXT_NODE_ID + '.');
            if (!isHydrateAnnotation) {
                return;
            }
        }
        const isWithinWhitespaceSensitiveNode = opts.newLines || opts.indentSpaces > 0 ? isWithinWhitespaceSensitive(node) : false;
        if (opts.newLines && !isWithinWhitespaceSensitiveNode) {
            output.text.push('\n');
            output.currentLineWidth = 0;
        }
        if (opts.indentSpaces > 0 && !isWithinWhitespaceSensitiveNode) {
            for (let i = 0; i < output.indent; i++) {
                output.text.push(' ');
            }
            output.currentLineWidth += output.indent;
        }
        output.text.push('<!--' + nodeValue + '-->');
        output.currentLineWidth += nodeValue.length + 7;
    }
    else if (node.nodeType === 10 /* NODE_TYPES.DOCUMENT_TYPE_NODE */) {
        output.text.push('<!doctype html>');
    }
}
const AMP_REGEX = /&/g;
const NBSP_REGEX = /\u00a0/g;
const DOUBLE_QUOTE_REGEX = /"/g;
const LT_REGEX = /</g;
const GT_REGEX = />/g;
const CAN_REMOVE_ATTR_QUOTES = /^[^ \t\n\f\r"'`=<>\/\\-]+$/;
function getTagName(element) {
    if (element.namespaceURI === 'http://www.w3.org/1999/xhtml') {
        return element.nodeName.toLowerCase();
    }
    else {
        return element.nodeName;
    }
}
function escapeString(str, attrMode) {
    str = str.replace(AMP_REGEX, '&amp;').replace(NBSP_REGEX, '&nbsp;');
    if (attrMode) {
        return str.replace(DOUBLE_QUOTE_REGEX, '&quot;');
    }
    return str.replace(LT_REGEX, '&lt;').replace(GT_REGEX, '&gt;');
}
function isWithinWhitespaceSensitive(node) {
    while (node != null) {
        if (WHITESPACE_SENSITIVE.has(node.nodeName)) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}
 const NON_ESCAPABLE_CONTENT = new Set([
    'STYLE',
    'SCRIPT',
    'IFRAME',
    'NOSCRIPT',
    'XMP',
    'NOEMBED',
    'NOFRAMES',
    'PLAINTEXT',
]);
 const WHITESPACE_SENSITIVE = new Set([
    'CODE',
    'OUTPUT',
    'PLAINTEXT',
    'PRE',
    'SCRIPT',
    'TEMPLATE',
    'TEXTAREA',
]);
 const EMPTY_ELEMENTS = new Set([
    'area',
    'base',
    'basefont',
    'bgsound',
    'br',
    'col',
    'embed',
    'frame',
    'hr',
    'img',
    'input',
    'keygen',
    'link',
    'meta',
    'param',
    'source',
    'trace',
    'wbr',
]);
 const REMOVE_EMPTY_ATTR = new Set(['class', 'dir', 'id', 'lang', 'name', 'title']);
 const BOOLEAN_ATTR = new Set([
    'allowfullscreen',
    'async',
    'autofocus',
    'autoplay',
    'checked',
    'compact',
    'controls',
    'declare',
    'default',
    'defaultchecked',
    'defaultmuted',
    'defaultselected',
    'defer',
    'disabled',
    'enabled',
    'formnovalidate',
    'hidden',
    'indeterminate',
    'inert',
    'ismap',
    'itemscope',
    'loop',
    'multiple',
    'muted',
    'nohref',
    'nomodule',
    'noresize',
    'noshade',
    'novalidate',
    'nowrap',
    'open',
    'pauseonexit',
    'readonly',
    'required',
    'reversed',
    'scoped',
    'seamless',
    'selected',
    'sortable',
    'truespeed',
    'typemustmatch',
    'visible',
]);
 const STRUCTURE_ELEMENTS = new Set([
    'html',
    'body',
    'head',
    'iframe',
    'meta',
    'link',
    'base',
    'title',
    'script',
    'style',
]);

class MockNode {
    constructor(ownerDocument, nodeType, nodeName, nodeValue) {
        this.ownerDocument = ownerDocument;
        this.nodeType = nodeType;
        this.nodeName = nodeName;
        this._nodeValue = nodeValue;
        this.parentNode = null;
        this.childNodes = [];
    }
    appendChild(newNode) {
        if (newNode.nodeType === 11 /* NODE_TYPES.DOCUMENT_FRAGMENT_NODE */) {
            const nodes = newNode.childNodes.slice();
            for (const child of nodes) {
                this.appendChild(child);
            }
        }
        else {
            newNode.remove();
            newNode.parentNode = this;
            this.childNodes.push(newNode);
            connectNode(this.ownerDocument, newNode);
        }
        return newNode;
    }
    append(...items) {
        items.forEach((item) => {
            const isNode = typeof item === 'object' && item !== null && 'nodeType' in item;
            this.appendChild(isNode ? item : this.ownerDocument.createTextNode(String(item)));
        });
    }
    prepend(...items) {
        const firstChild = this.firstChild;
        items.forEach((item) => {
            const isNode = typeof item === 'object' && item !== null && 'nodeType' in item;
            if (firstChild) {
                this.insertBefore(isNode ? item : this.ownerDocument.createTextNode(String(item)), firstChild);
            }
        });
    }
    cloneNode(deep) {
        throw new Error(`invalid node type to clone: ${this.nodeType}, deep: ${deep}`);
    }
    compareDocumentPosition(_other) {
        // unimplemented
        // https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
        return -1;
    }
    get firstChild() {
        return this.childNodes[0] || null;
    }
    insertBefore(newNode, referenceNode) {
        if (newNode.nodeType === 11 /* NODE_TYPES.DOCUMENT_FRAGMENT_NODE */) {
            for (let i = 0, ii = newNode.childNodes.length; i < ii; i++) {
                insertBefore(this, newNode.childNodes[i], referenceNode);
            }
        }
        else {
            insertBefore(this, newNode, referenceNode);
        }
        return newNode;
    }
    get isConnected() {
        let node = this;
        while (node != null) {
            if (node.nodeType === 9 /* NODE_TYPES.DOCUMENT_NODE */) {
                return true;
            }
            node = node.parentNode;
            if (node != null && node.nodeType === 11 /* NODE_TYPES.DOCUMENT_FRAGMENT_NODE */) {
                node = node.host;
            }
        }
        return false;
    }
    isSameNode(node) {
        return this === node;
    }
    get lastChild() {
        return this.childNodes[this.childNodes.length - 1] || null;
    }
    get nextSibling() {
        if (this.parentNode != null) {
            const index = this.parentNode.childNodes.indexOf(this) + 1;
            return this.parentNode.childNodes[index] || null;
        }
        return null;
    }
    get nodeValue() {
        var _a;
        return (_a = this._nodeValue) !== null && _a !== void 0 ? _a : '';
    }
    set nodeValue(value) {
        this._nodeValue = value;
    }
    get parentElement() {
        return this.parentNode || null;
    }
    set parentElement(value) {
        this.parentNode = value;
    }
    get previousSibling() {
        if (this.parentNode != null) {
            const index = this.parentNode.childNodes.indexOf(this) - 1;
            return this.parentNode.childNodes[index] || null;
        }
        return null;
    }
    contains(otherNode) {
        if (otherNode === this) {
            return true;
        }
        const childNodes = Array.from(this.childNodes);
        if (childNodes.includes(otherNode)) {
            return true;
        }
        return childNodes.some((node) => this.contains.bind(node)(otherNode));
    }
    removeChild(childNode) {
        const index = this.childNodes.indexOf(childNode);
        if (index > -1) {
            this.childNodes.splice(index, 1);
            if (this.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */) {
                const wasConnected = this.isConnected;
                childNode.parentNode = null;
                if (wasConnected === true) {
                    disconnectNode(childNode);
                }
            }
            else {
                childNode.parentNode = null;
            }
        }
        else {
            throw new Error(`node not found within childNodes during removeChild`);
        }
        return childNode;
    }
    remove() {
        if (this.parentNode != null) {
            this.parentNode.removeChild(this);
        }
    }
    replaceChild(newChild, oldChild) {
        if (oldChild.parentNode === this) {
            this.insertBefore(newChild, oldChild);
            oldChild.remove();
            return newChild;
        }
        return null;
    }
    get textContent() {
        var _a;
        return (_a = this._nodeValue) !== null && _a !== void 0 ? _a : '';
    }
    set textContent(value) {
        this._nodeValue = String(value);
    }
}
MockNode.ELEMENT_NODE = 1;
MockNode.TEXT_NODE = 3;
MockNode.PROCESSING_INSTRUCTION_NODE = 7;
MockNode.COMMENT_NODE = 8;
MockNode.DOCUMENT_NODE = 9;
MockNode.DOCUMENT_TYPE_NODE = 10;
MockNode.DOCUMENT_FRAGMENT_NODE = 11;
class MockNodeList {
    constructor(ownerDocument, childNodes, length) {
        this.ownerDocument = ownerDocument;
        this.childNodes = childNodes;
        this.length = length;
    }
}
class MockElement extends MockNode {
    attachInternals() {
        return new Proxy({}, {
            get: function (_target, prop, _receiver) {
                console.error(`NOTE: Property ${String(prop)} was accessed on ElementInternals, but this property is not implemented.
Testing components with ElementInternals is fully supported in e2e tests.`);
            },
        });
    }
    constructor(ownerDocument, nodeName, namespaceURI = null) {
        super(ownerDocument, 1 /* NODE_TYPES.ELEMENT_NODE */, typeof nodeName === 'string' ? nodeName : null, null);
        this.__namespaceURI = namespaceURI;
        this.__shadowRoot = null;
        this.__attributeMap = null;
    }
    addEventListener(type, handler) {
        addEventListener(this, type, handler);
    }
    attachShadow(_opts) {
        const shadowRoot = this.ownerDocument.createDocumentFragment();
        this.shadowRoot = shadowRoot;
        return shadowRoot;
    }
    blur() {
        dispatchEvent(this, new MockFocusEvent('blur', { relatedTarget: null, bubbles: true, cancelable: true, composed: true }));
    }
    get namespaceURI() {
        return this.__namespaceURI;
    }
    get shadowRoot() {
        return this.__shadowRoot || null;
    }
    set shadowRoot(shadowRoot) {
        if (shadowRoot != null) {
            shadowRoot.host = this;
            this.__shadowRoot = shadowRoot;
        }
        else {
            delete this.__shadowRoot;
        }
    }
    get attributes() {
        if (this.__attributeMap == null) {
            const attrMap = createAttributeProxy(false);
            this.__attributeMap = attrMap;
            return attrMap;
        }
        return this.__attributeMap;
    }
    set attributes(attrs) {
        this.__attributeMap = attrs;
    }
    get children() {
        return this.childNodes.filter((n) => n.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */);
    }
    get childElementCount() {
        return this.childNodes.filter((n) => n.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */).length;
    }
    get className() {
        return this.getAttributeNS(null, 'class') || '';
    }
    set className(value) {
        this.setAttributeNS(null, 'class', value);
    }
    get classList() {
        return new MockClassList(this);
    }
    click() {
        dispatchEvent(this, new MockEvent('click', { bubbles: true, cancelable: true, composed: true }));
    }
    cloneNode(_deep) {
        // implemented on MockElement.prototype from within element.ts
        // @ts-ignore - implemented on MockElement.prototype from within element.ts
        return null;
    }
    closest(selector) {
        let elm = this;
        while (elm != null) {
            if (elm.matches(selector)) {
                return elm;
            }
            elm = elm.parentNode;
        }
        return null;
    }
    get dataset() {
        return dataset(this);
    }
    get dir() {
        return this.getAttributeNS(null, 'dir') || '';
    }
    set dir(value) {
        this.setAttributeNS(null, 'dir', value);
    }
    dispatchEvent(ev) {
        return dispatchEvent(this, ev);
    }
    get firstElementChild() {
        return this.children[0] || null;
    }
    focus(_options) {
        dispatchEvent(this, new MockFocusEvent('focus', { relatedTarget: null, bubbles: true, cancelable: true, composed: true }));
    }
    getAttribute(attrName) {
        if (attrName === 'style') {
            if (this.__style != null && this.__style.length > 0) {
                return this.style.cssText;
            }
            return null;
        }
        const attr = this.attributes.getNamedItem(attrName);
        if (attr != null) {
            return attr.value;
        }
        return null;
    }
    getAttributeNS(namespaceURI, attrName) {
        const attr = this.attributes.getNamedItemNS(namespaceURI, attrName);
        if (attr != null) {
            return attr.value;
        }
        return null;
    }
    getAttributeNode(attrName) {
        if (!this.hasAttribute(attrName)) {
            return null;
        }
        return new MockAttr(attrName, this.getAttribute(attrName));
    }
    getBoundingClientRect() {
        return { bottom: 0, height: 0, left: 0, right: 0, top: 0, width: 0, x: 0, y: 0 };
    }
    getRootNode(opts) {
        const isComposed = opts != null && opts.composed === true;
        let node = this;
        while (node.parentNode != null) {
            node = node.parentNode;
            if (isComposed === true && node.parentNode == null && node.host != null) {
                node = node.host;
            }
        }
        return node;
    }
    get draggable() {
        return this.getAttributeNS(null, 'draggable') === 'true';
    }
    set draggable(value) {
        this.setAttributeNS(null, 'draggable', value);
    }
    hasChildNodes() {
        return this.childNodes.length > 0;
    }
    get id() {
        return this.getAttributeNS(null, 'id') || '';
    }
    set id(value) {
        this.setAttributeNS(null, 'id', value);
    }
    get innerHTML() {
        if (this.childNodes.length === 0) {
            return '';
        }
        return serializeNodeToHtml(this, {
            newLines: false,
            indentSpaces: 0,
        });
    }
    set innerHTML(html) {
        var _a;
        if (NON_ESCAPABLE_CONTENT.has((_a = this.nodeName) !== null && _a !== void 0 ? _a : '') === true) {
            setTextContent(this, html);
        }
        else {
            for (let i = this.childNodes.length - 1; i >= 0; i--) {
                this.removeChild(this.childNodes[i]);
            }
            if (typeof html === 'string') {
                const frag = parseFragmentUtil(this.ownerDocument, html);
                while (frag.childNodes.length > 0) {
                    this.appendChild(frag.childNodes[0]);
                }
            }
        }
    }
    get innerText() {
        const text = [];
        getTextContent(this.childNodes, text);
        return text.join('');
    }
    set innerText(value) {
        setTextContent(this, value);
    }
    insertAdjacentElement(position, elm) {
        if (position === 'beforebegin') {
            insertBefore(this.parentNode, elm, this);
        }
        else if (position === 'afterbegin') {
            this.prepend(elm);
        }
        else if (position === 'beforeend') {
            this.appendChild(elm);
        }
        else if (position === 'afterend') {
            insertBefore(this.parentNode, elm, this.nextSibling);
        }
        return elm;
    }
    insertAdjacentHTML(position, html) {
        const frag = parseFragmentUtil(this.ownerDocument, html);
        if (position === 'beforebegin') {
            while (frag.childNodes.length > 0) {
                insertBefore(this.parentNode, frag.childNodes[0], this);
            }
        }
        else if (position === 'afterbegin') {
            while (frag.childNodes.length > 0) {
                this.prepend(frag.childNodes[frag.childNodes.length - 1]);
            }
        }
        else if (position === 'beforeend') {
            while (frag.childNodes.length > 0) {
                this.appendChild(frag.childNodes[0]);
            }
        }
        else if (position === 'afterend') {
            while (frag.childNodes.length > 0) {
                insertBefore(this.parentNode, frag.childNodes[frag.childNodes.length - 1], this.nextSibling);
            }
        }
    }
    insertAdjacentText(position, text) {
        const elm = this.ownerDocument.createTextNode(text);
        if (position === 'beforebegin') {
            insertBefore(this.parentNode, elm, this);
        }
        else if (position === 'afterbegin') {
            this.prepend(elm);
        }
        else if (position === 'beforeend') {
            this.appendChild(elm);
        }
        else if (position === 'afterend') {
            insertBefore(this.parentNode, elm, this.nextSibling);
        }
    }
    hasAttribute(attrName) {
        if (attrName === 'style') {
            return this.__style != null && this.__style.length > 0;
        }
        return this.getAttribute(attrName) !== null;
    }
    hasAttributeNS(namespaceURI, name) {
        return this.getAttributeNS(namespaceURI, name) !== null;
    }
    get hidden() {
        return this.hasAttributeNS(null, 'hidden');
    }
    set hidden(isHidden) {
        if (isHidden === true) {
            this.setAttributeNS(null, 'hidden', '');
        }
        else {
            this.removeAttributeNS(null, 'hidden');
        }
    }
    get lang() {
        return this.getAttributeNS(null, 'lang') || '';
    }
    set lang(value) {
        this.setAttributeNS(null, 'lang', value);
    }
    get lastElementChild() {
        const children = this.children;
        return children[children.length - 1] || null;
    }
    matches(selector) {
        return matches(selector, this);
    }
    get nextElementSibling() {
        const parentElement = this.parentElement;
        if (parentElement != null &&
            (parentElement.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */ ||
                parentElement.nodeType === 11 /* NODE_TYPES.DOCUMENT_FRAGMENT_NODE */ ||
                parentElement.nodeType === 9 /* NODE_TYPES.DOCUMENT_NODE */)) {
            const children = parentElement.children;
            const index = children.indexOf(this) + 1;
            return parentElement.children[index] || null;
        }
        return null;
    }
    get outerHTML() {
        return serializeNodeToHtml(this, {
            newLines: false,
            outerHtml: true,
            indentSpaces: 0,
        });
    }
    get previousElementSibling() {
        const parentElement = this.parentElement;
        if (parentElement != null &&
            (parentElement.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */ ||
                parentElement.nodeType === 11 /* NODE_TYPES.DOCUMENT_FRAGMENT_NODE */ ||
                parentElement.nodeType === 9 /* NODE_TYPES.DOCUMENT_NODE */)) {
            const children = parentElement.children;
            const index = children.indexOf(this) - 1;
            return parentElement.children[index] || null;
        }
        return null;
    }
    getElementsByClassName(classNames) {
        const classes = classNames
            .trim()
            .split(' ')
            .filter((c) => c.length > 0);
        const results = [];
        getElementsByClassName(this, classes, results);
        return results;
    }
    getElementsByTagName(tagName) {
        const results = [];
        getElementsByTagName(this, tagName.toLowerCase(), results);
        return results;
    }
    querySelector(selector) {
        return selectOne(selector, this);
    }
    querySelectorAll(selector) {
        return selectAll(selector, this);
    }
    removeAttribute(attrName) {
        if (attrName === 'style') {
            delete this.__style;
        }
        else {
            const attr = this.attributes.getNamedItem(attrName);
            if (attr != null) {
                this.attributes.removeNamedItemNS(attr);
                if (checkAttributeChanged(this) === true) {
                    attributeChanged(this, attrName, attr.value, null);
                }
            }
        }
    }
    removeAttributeNS(namespaceURI, attrName) {
        const attr = this.attributes.getNamedItemNS(namespaceURI, attrName);
        if (attr != null) {
            this.attributes.removeNamedItemNS(attr);
            if (checkAttributeChanged(this) === true) {
                attributeChanged(this, attrName, attr.value, null);
            }
        }
    }
    removeEventListener(type, handler) {
        removeEventListener(this, type, handler);
    }
    setAttribute(attrName, value) {
        if (attrName === 'style') {
            this.style = value;
        }
        else {
            const attributes = this.attributes;
            let attr = attributes.getNamedItem(attrName);
            const checkAttrChanged = checkAttributeChanged(this);
            if (attr != null) {
                if (checkAttrChanged === true) {
                    const oldValue = attr.value;
                    attr.value = value;
                    if (oldValue !== attr.value) {
                        attributeChanged(this, attr.name, oldValue, attr.value);
                    }
                }
                else {
                    attr.value = value;
                }
            }
            else {
                if (attributes.caseInsensitive) {
                    attrName = attrName.toLowerCase();
                }
                attr = new MockAttr(attrName, value);
                attributes.__items.push(attr);
                if (checkAttrChanged === true) {
                    attributeChanged(this, attrName, null, attr.value);
                }
            }
        }
    }
    setAttributeNS(namespaceURI, attrName, value) {
        const attributes = this.attributes;
        let attr = attributes.getNamedItemNS(namespaceURI, attrName);
        const checkAttrChanged = checkAttributeChanged(this);
        if (attr != null) {
            if (checkAttrChanged === true) {
                const oldValue = attr.value;
                attr.value = value;
                if (oldValue !== attr.value) {
                    attributeChanged(this, attr.name, oldValue, attr.value);
                }
            }
            else {
                attr.value = value;
            }
        }
        else {
            attr = new MockAttr(attrName, value, namespaceURI);
            attributes.__items.push(attr);
            if (checkAttrChanged === true) {
                attributeChanged(this, attrName, null, attr.value);
            }
        }
    }
    get style() {
        if (this.__style == null) {
            this.__style = createCSSStyleDeclaration();
        }
        return this.__style;
    }
    set style(val) {
        if (typeof val === 'string') {
            if (this.__style == null) {
                this.__style = createCSSStyleDeclaration();
            }
            this.__style.cssText = val;
        }
        else {
            this.__style = val;
        }
    }
    get tabIndex() {
        return parseInt(this.getAttributeNS(null, 'tabindex') || '-1', 10);
    }
    set tabIndex(value) {
        this.setAttributeNS(null, 'tabindex', value);
    }
    get tagName() {
        var _a;
        return (_a = this.nodeName) !== null && _a !== void 0 ? _a : '';
    }
    set tagName(value) {
        this.nodeName = value;
    }
    get textContent() {
        const text = [];
        getTextContent(this.childNodes, text);
        return text.join('');
    }
    set textContent(value) {
        setTextContent(this, value);
    }
    get title() {
        return this.getAttributeNS(null, 'title') || '';
    }
    set title(value) {
        this.setAttributeNS(null, 'title', value);
    }
    animate() {
        /**/
    }
    onanimationstart() {
        /**/
    }
    onanimationend() {
        /**/
    }
    onanimationiteration() {
        /**/
    }
    onabort() {
        /**/
    }
    onauxclick() {
        /**/
    }
    onbeforecopy() {
        /**/
    }
    onbeforecut() {
        /**/
    }
    onbeforepaste() {
        /**/
    }
    onblur() {
        /**/
    }
    oncancel() {
        /**/
    }
    oncanplay() {
        /**/
    }
    oncanplaythrough() {
        /**/
    }
    onchange() {
        /**/
    }
    onclick() {
        /**/
    }
    onclose() {
        /**/
    }
    oncontextmenu() {
        /**/
    }
    oncopy() {
        /**/
    }
    oncuechange() {
        /**/
    }
    oncut() {
        /**/
    }
    ondblclick() {
        /**/
    }
    ondrag() {
        /**/
    }
    ondragend() {
        /**/
    }
    ondragenter() {
        /**/
    }
    ondragleave() {
        /**/
    }
    ondragover() {
        /**/
    }
    ondragstart() {
        /**/
    }
    ondrop() {
        /**/
    }
    ondurationchange() {
        /**/
    }
    onemptied() {
        /**/
    }
    onended() {
        /**/
    }
    onerror() {
        /**/
    }
    onfocus() {
        /**/
    }
    onfocusin() {
        /**/
    }
    onfocusout() {
        /**/
    }
    onformdata() {
        /**/
    }
    onfullscreenchange() {
        /**/
    }
    onfullscreenerror() {
        /**/
    }
    ongotpointercapture() {
        /**/
    }
    oninput() {
        /**/
    }
    oninvalid() {
        /**/
    }
    onkeydown() {
        /**/
    }
    onkeypress() {
        /**/
    }
    onkeyup() {
        /**/
    }
    onload() {
        /**/
    }
    onloadeddata() {
        /**/
    }
    onloadedmetadata() {
        /**/
    }
    onloadstart() {
        /**/
    }
    onlostpointercapture() {
        /**/
    }
    onmousedown() {
        /**/
    }
    onmouseenter() {
        /**/
    }
    onmouseleave() {
        /**/
    }
    onmousemove() {
        /**/
    }
    onmouseout() {
        /**/
    }
    onmouseover() {
        /**/
    }
    onmouseup() {
        /**/
    }
    onmousewheel() {
        /**/
    }
    onpaste() {
        /**/
    }
    onpause() {
        /**/
    }
    onplay() {
        /**/
    }
    onplaying() {
        /**/
    }
    onpointercancel() {
        /**/
    }
    onpointerdown() {
        /**/
    }
    onpointerenter() {
        /**/
    }
    onpointerleave() {
        /**/
    }
    onpointermove() {
        /**/
    }
    onpointerout() {
        /**/
    }
    onpointerover() {
        /**/
    }
    onpointerup() {
        /**/
    }
    onprogress() {
        /**/
    }
    onratechange() {
        /**/
    }
    onreset() {
        /**/
    }
    onresize() {
        /**/
    }
    onscroll() {
        /**/
    }
    onsearch() {
        /**/
    }
    onseeked() {
        /**/
    }
    onseeking() {
        /**/
    }
    onselect() {
        /**/
    }
    onselectstart() {
        /**/
    }
    onstalled() {
        /**/
    }
    onsubmit() {
        /**/
    }
    onsuspend() {
        /**/
    }
    ontimeupdate() {
        /**/
    }
    ontoggle() {
        /**/
    }
    onvolumechange() {
        /**/
    }
    onwaiting() {
        /**/
    }
    onwebkitfullscreenchange() {
        /**/
    }
    onwebkitfullscreenerror() {
        /**/
    }
    onwheel() {
        /**/
    }
    requestFullscreen() {
        /**/
    }
    scrollBy() {
        /**/
    }
    scrollTo() {
        /**/
    }
    scrollIntoView() {
        /**/
    }
    toString(opts) {
        return serializeNodeToHtml(this, opts);
    }
}
function getElementsByClassName(elm, classNames, foundElms) {
    const children = elm.children;
    for (let i = 0, ii = children.length; i < ii; i++) {
        const childElm = children[i];
        for (let j = 0, jj = classNames.length; j < jj; j++) {
            if (childElm.classList.contains(classNames[j])) {
                foundElms.push(childElm);
            }
        }
        getElementsByClassName(childElm, classNames, foundElms);
    }
}
function getElementsByTagName(elm, tagName, foundElms) {
    var _a;
    const children = elm.children;
    for (let i = 0, ii = children.length; i < ii; i++) {
        const childElm = children[i];
        if (tagName === '*' || ((_a = childElm.nodeName) !== null && _a !== void 0 ? _a : '').toLowerCase() === tagName) {
            foundElms.push(childElm);
        }
        getElementsByTagName(childElm, tagName, foundElms);
    }
}
function resetElement(elm) {
    resetEventListeners(elm);
    delete elm.__attributeMap;
    delete elm.__shadowRoot;
    delete elm.__style;
}
function insertBefore(parentNode, newNode, referenceNode) {
    if (newNode !== referenceNode) {
        newNode.remove();
        newNode.parentNode = parentNode;
        newNode.ownerDocument = parentNode.ownerDocument;
        if (referenceNode != null) {
            const index = parentNode.childNodes.indexOf(referenceNode);
            if (index > -1) {
                parentNode.childNodes.splice(index, 0, newNode);
            }
            else {
                throw new Error(`referenceNode not found in parentNode.childNodes`);
            }
        }
        else {
            parentNode.childNodes.push(newNode);
        }
        connectNode(parentNode.ownerDocument, newNode);
    }
    return newNode;
}
class MockHTMLElement extends MockElement {
    constructor(ownerDocument, nodeName) {
        super(ownerDocument, typeof nodeName === 'string' ? nodeName.toUpperCase() : null);
        this.__namespaceURI = 'http://www.w3.org/1999/xhtml';
    }
    get tagName() {
        var _a;
        return (_a = this.nodeName) !== null && _a !== void 0 ? _a : '';
    }
    set tagName(value) {
        this.nodeName = value;
    }
    get attributes() {
        if (this.__attributeMap == null) {
            const attrMap = createAttributeProxy(true);
            this.__attributeMap = attrMap;
            return attrMap;
        }
        return this.__attributeMap;
    }
    set attributes(attrs) {
        this.__attributeMap = attrs;
    }
}
class MockTextNode extends MockNode {
    constructor(ownerDocument, text) {
        super(ownerDocument, 3 /* NODE_TYPES.TEXT_NODE */, "#text" /* NODE_NAMES.TEXT_NODE */, text);
    }
    cloneNode(_deep) {
        return new MockTextNode(null, this.nodeValue);
    }
    get textContent() {
        return this.nodeValue;
    }
    set textContent(text) {
        this.nodeValue = text;
    }
    get data() {
        return this.nodeValue;
    }
    set data(text) {
        this.nodeValue = text;
    }
    get wholeText() {
        if (this.parentNode != null) {
            const text = [];
            for (let i = 0, ii = this.parentNode.childNodes.length; i < ii; i++) {
                const childNode = this.parentNode.childNodes[i];
                if (childNode.nodeType === 3 /* NODE_TYPES.TEXT_NODE */) {
                    text.push(childNode.nodeValue);
                }
            }
            return text.join('');
        }
        return this.nodeValue;
    }
}
function getTextContent(childNodes, text) {
    for (let i = 0, ii = childNodes.length; i < ii; i++) {
        const childNode = childNodes[i];
        if (childNode.nodeType === 3 /* NODE_TYPES.TEXT_NODE */) {
            text.push(childNode.nodeValue);
        }
        else if (childNode.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */) {
            getTextContent(childNode.childNodes, text);
        }
    }
}
function setTextContent(elm, text) {
    for (let i = elm.childNodes.length - 1; i >= 0; i--) {
        elm.removeChild(elm.childNodes[i]);
    }
    const textNode = new MockTextNode(elm.ownerDocument, text);
    elm.appendChild(textNode);
}

class MockComment extends MockNode {
    constructor(ownerDocument, data) {
        super(ownerDocument, 8 /* NODE_TYPES.COMMENT_NODE */, "#comment" /* NODE_NAMES.COMMENT_NODE */, data);
    }
    cloneNode(_deep) {
        return new MockComment(null, this.nodeValue);
    }
    get textContent() {
        return this.nodeValue;
    }
    set textContent(text) {
        this.nodeValue = text;
    }
}

class MockDocumentFragment extends MockHTMLElement {
    constructor(ownerDocument) {
        super(ownerDocument, null);
        this.nodeName = "#document-fragment" /* NODE_NAMES.DOCUMENT_FRAGMENT_NODE */;
        this.nodeType = 11 /* NODE_TYPES.DOCUMENT_FRAGMENT_NODE */;
    }
    getElementById(id) {
        return getElementById(this, id);
    }
    cloneNode(deep) {
        const cloned = new MockDocumentFragment(null);
        if (deep) {
            for (let i = 0, ii = this.childNodes.length; i < ii; i++) {
                const childNode = this.childNodes[i];
                if (childNode.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */ ||
                    childNode.nodeType === 3 /* NODE_TYPES.TEXT_NODE */ ||
                    childNode.nodeType === 8 /* NODE_TYPES.COMMENT_NODE */) {
                    const clonedChildNode = this.childNodes[i].cloneNode(true);
                    cloned.appendChild(clonedChildNode);
                }
            }
        }
        return cloned;
    }
}

class MockDocumentTypeNode extends MockHTMLElement {
    constructor(ownerDocument) {
        super(ownerDocument, '!DOCTYPE');
        this.nodeType = 10 /* NODE_TYPES.DOCUMENT_TYPE_NODE */;
        this.setAttribute('html', '');
    }
}

class MockCSSRule {
    constructor(parentStyleSheet) {
        this.parentStyleSheet = parentStyleSheet;
        this.cssText = '';
        this.type = 0;
    }
}
class MockCSSStyleSheet {
    constructor(ownerNode) {
        this.type = 'text/css';
        this.parentStyleSheet = null;
        this.cssRules = [];
        this.ownerNode = ownerNode;
    }
    get rules() {
        return this.cssRules;
    }
    set rules(rules) {
        this.cssRules = rules;
    }
    deleteRule(index) {
        if (index >= 0 && index < this.cssRules.length) {
            this.cssRules.splice(index, 1);
            updateStyleTextNode(this.ownerNode);
        }
    }
    insertRule(rule, index = 0) {
        if (typeof index !== 'number') {
            index = 0;
        }
        if (index < 0) {
            index = 0;
        }
        if (index > this.cssRules.length) {
            index = this.cssRules.length;
        }
        const cssRule = new MockCSSRule(this);
        cssRule.cssText = rule;
        this.cssRules.splice(index, 0, cssRule);
        updateStyleTextNode(this.ownerNode);
        return index;
    }
}
function getStyleElementText(styleElm) {
    const output = [];
    for (let i = 0; i < styleElm.childNodes.length; i++) {
        output.push(styleElm.childNodes[i].nodeValue);
    }
    return output.join('');
}
function setStyleElementText(styleElm, text) {
    // keeping the innerHTML and the sheet.cssRules connected
    // is not technically correct, but since we're doing
    // SSR we'll need to turn any assigned cssRules into
    // real text, not just properties that aren't rendered
    const sheet = styleElm.sheet;
    sheet.cssRules.length = 0;
    sheet.insertRule(text);
    updateStyleTextNode(styleElm);
}
function updateStyleTextNode(styleElm) {
    const childNodeLen = styleElm.childNodes.length;
    if (childNodeLen > 1) {
        for (let i = childNodeLen - 1; i >= 1; i--) {
            styleElm.removeChild(styleElm.childNodes[i]);
        }
    }
    else if (childNodeLen < 1) {
        styleElm.appendChild(styleElm.ownerDocument.createTextNode(''));
    }
    const textNode = styleElm.childNodes[0];
    textNode.nodeValue = styleElm.sheet.cssRules.map((r) => r.cssText).join('\n');
}

function createElement(ownerDocument, tagName) {
    if (typeof tagName !== 'string' || tagName === '' || !/^[a-z0-9-_:]+$/i.test(tagName)) {
        throw new Error(`The tag name provided (${tagName}) is not a valid name.`);
    }
    tagName = tagName.toLowerCase();
    switch (tagName) {
        case 'a':
            return new MockAnchorElement(ownerDocument);
        case 'base':
            return new MockBaseElement(ownerDocument);
        case 'button':
            return new MockButtonElement(ownerDocument);
        case 'canvas':
            return new MockCanvasElement(ownerDocument);
        case 'form':
            return new MockFormElement(ownerDocument);
        case 'img':
            return new MockImageElement(ownerDocument);
        case 'input':
            return new MockInputElement(ownerDocument);
        case 'link':
            return new MockLinkElement(ownerDocument);
        case 'meta':
            return new MockMetaElement(ownerDocument);
        case 'script':
            return new MockScriptElement(ownerDocument);
        case 'style':
            return new MockStyleElement(ownerDocument);
        case 'template':
            return new MockTemplateElement(ownerDocument);
        case 'title':
            return new MockTitleElement(ownerDocument);
        case 'ul':
            return new MockUListElement(ownerDocument);
    }
    if (ownerDocument != null && tagName.includes('-')) {
        const win = ownerDocument.defaultView;
        if (win != null && win.customElements != null) {
            return createCustomElement(win.customElements, ownerDocument, tagName);
        }
    }
    return new MockHTMLElement(ownerDocument, tagName);
}
function createElementNS(ownerDocument, namespaceURI, tagName) {
    if (namespaceURI === 'http://www.w3.org/1999/xhtml') {
        return createElement(ownerDocument, tagName);
    }
    else if (namespaceURI === 'http://www.w3.org/2000/svg') {
        switch (tagName.toLowerCase()) {
            case 'text':
            case 'tspan':
            case 'tref':
            case 'altglyph':
            case 'textpath':
                return new MockSVGTextContentElement(ownerDocument, tagName);
            case 'circle':
            case 'ellipse':
            case 'image':
            case 'line':
            case 'path':
            case 'polygon':
            case 'polyline':
            case 'rect':
            case 'use':
                return new MockSVGGraphicsElement(ownerDocument, tagName);
            case 'svg':
                return new MockSVGSVGElement(ownerDocument, tagName);
            default:
                return new MockSVGElement(ownerDocument, tagName);
        }
    }
    else {
        return new MockElement(ownerDocument, tagName, namespaceURI);
    }
}
class MockAnchorElement extends MockHTMLElement {
    constructor(ownerDocument) {
        super(ownerDocument, 'a');
    }
    get href() {
        return fullUrl(this, 'href');
    }
    set href(value) {
        this.setAttribute('href', value);
    }
    get pathname() {
        return new URL(this.href).pathname;
    }
}
class MockButtonElement extends MockHTMLElement {
    constructor(ownerDocument) {
        super(ownerDocument, 'button');
    }
}
patchPropAttributes(MockButtonElement.prototype, {
    type: String,
}, {
    type: 'submit',
});
class MockImageElement extends MockHTMLElement {
    constructor(ownerDocument) {
        super(ownerDocument, 'img');
    }
    get draggable() {
        return this.getAttributeNS(null, 'draggable') !== 'false';
    }
    set draggable(value) {
        this.setAttributeNS(null, 'draggable', value);
    }
    get src() {
        return fullUrl(this, 'src');
    }
    set src(value) {
        this.setAttribute('src', value);
    }
}
patchPropAttributes(MockImageElement.prototype, {
    height: Number,
    width: Number,
});
class MockInputElement extends MockHTMLElement {
    constructor(ownerDocument) {
        super(ownerDocument, 'input');
    }
    get list() {
        const listId = this.getAttribute('list');
        if (listId) {
            return this.ownerDocument.getElementById(listId);
        }
        return null;
    }
}
patchPropAttributes(MockInputElement.prototype, {
    accept: String,
    autocomplete: String,
    autofocus: Boolean,
    capture: String,
    checked: Boolean,
    disabled: Boolean,
    form: String,
    formaction: String,
    formenctype: String,
    formmethod: String,
    formnovalidate: String,
    formtarget: String,
    height: Number,
    inputmode: String,
    max: String,
    maxLength: Number,
    min: String,
    minLength: Number,
    multiple: Boolean,
    name: String,
    pattern: String,
    placeholder: String,
    required: Boolean,
    readOnly: Boolean,
    size: Number,
    spellCheck: Boolean,
    src: String,
    step: String,
    type: String,
    value: String,
    width: Number,
}, {
    type: 'text',
});
class MockFormElement extends MockHTMLElement {
    constructor(ownerDocument) {
        super(ownerDocument, 'form');
    }
}
patchPropAttributes(MockFormElement.prototype, {
    name: String,
});
class MockLinkElement extends MockHTMLElement {
    constructor(ownerDocument) {
        super(ownerDocument, 'link');
    }
    get href() {
        return fullUrl(this, 'href');
    }
    set href(value) {
        this.setAttribute('href', value);
    }
}
patchPropAttributes(MockLinkElement.prototype, {
    crossorigin: String,
    media: String,
    rel: String,
    type: String,
});
class MockMetaElement extends MockHTMLElement {
    constructor(ownerDocument) {
        super(ownerDocument, 'meta');
    }
}
patchPropAttributes(MockMetaElement.prototype, {
    charset: String,
    content: String,
    name: String,
});
class MockScriptElement extends MockHTMLElement {
    constructor(ownerDocument) {
        super(ownerDocument, 'script');
    }
    get src() {
        return fullUrl(this, 'src');
    }
    set src(value) {
        this.setAttribute('src', value);
    }
}
patchPropAttributes(MockScriptElement.prototype, {
    type: String,
});
class MockDOMMatrix {
    constructor() {
        this.a = 1;
        this.b = 0;
        this.c = 0;
        this.d = 1;
        this.e = 0;
        this.f = 0;
        this.m11 = 1;
        this.m12 = 0;
        this.m13 = 0;
        this.m14 = 0;
        this.m21 = 0;
        this.m22 = 1;
        this.m23 = 0;
        this.m24 = 0;
        this.m31 = 0;
        this.m32 = 0;
        this.m33 = 1;
        this.m34 = 0;
        this.m41 = 0;
        this.m42 = 0;
        this.m43 = 0;
        this.m44 = 1;
        this.is2D = true;
        this.isIdentity = true;
    }
    static fromMatrix() {
        return new MockDOMMatrix();
    }
    inverse() {
        return new MockDOMMatrix();
    }
    flipX() {
        return new MockDOMMatrix();
    }
    flipY() {
        return new MockDOMMatrix();
    }
    multiply() {
        return new MockDOMMatrix();
    }
    rotate() {
        return new MockDOMMatrix();
    }
    rotateAxisAngle() {
        return new MockDOMMatrix();
    }
    rotateFromVector() {
        return new MockDOMMatrix();
    }
    scale() {
        return new MockDOMMatrix();
    }
    scaleNonUniform() {
        return new MockDOMMatrix();
    }
    skewX() {
        return new MockDOMMatrix();
    }
    skewY() {
        return new MockDOMMatrix();
    }
    toJSON() { }
    toString() { }
    transformPoint() {
        return new MockDOMPoint();
    }
    translate() {
        return new MockDOMMatrix();
    }
}
class MockDOMPoint {
    constructor() {
        this.w = 1;
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
    toJSON() { }
    matrixTransform() {
        return new MockDOMMatrix();
    }
}
class MockSVGRect {
    constructor() {
        this.height = 10;
        this.width = 10;
        this.x = 0;
        this.y = 0;
    }
}
class MockStyleElement extends MockHTMLElement {
    constructor(ownerDocument) {
        super(ownerDocument, 'style');
        this.sheet = new MockCSSStyleSheet(this);
    }
    get innerHTML() {
        return getStyleElementText(this);
    }
    set innerHTML(value) {
        setStyleElementText(this, value);
    }
    get innerText() {
        return getStyleElementText(this);
    }
    set innerText(value) {
        setStyleElementText(this, value);
    }
    get textContent() {
        return getStyleElementText(this);
    }
    set textContent(value) {
        setStyleElementText(this, value);
    }
}
class MockSVGElement extends MockElement {
    constructor() {
        super(...arguments);
        this.__namespaceURI = 'http://www.w3.org/2000/svg';
    }
    // SVGElement properties and methods
    get ownerSVGElement() {
        return null;
    }
    get viewportElement() {
        return null;
    }
    onunload() {
        /**/
    }
    // SVGGeometryElement properties and methods
    get pathLength() {
        return 0;
    }
    isPointInFill(_pt) {
        return false;
    }
    isPointInStroke(_pt) {
        return false;
    }
    getTotalLength() {
        return 0;
    }
}
class MockSVGGraphicsElement extends MockSVGElement {
    getBBox(_options) {
        return new MockSVGRect();
    }
    getCTM() {
        return new MockDOMMatrix();
    }
    getScreenCTM() {
        return new MockDOMMatrix();
    }
}
class MockSVGSVGElement extends MockSVGGraphicsElement {
    createSVGPoint() {
        return new MockDOMPoint();
    }
}
class MockSVGTextContentElement extends MockSVGGraphicsElement {
    getComputedTextLength() {
        return 0;
    }
}
class MockBaseElement extends MockHTMLElement {
    constructor(ownerDocument) {
        super(ownerDocument, 'base');
    }
    get href() {
        return fullUrl(this, 'href');
    }
    set href(value) {
        this.setAttribute('href', value);
    }
}
class MockTemplateElement extends MockHTMLElement {
    constructor(ownerDocument) {
        super(ownerDocument, 'template');
        this.content = new MockDocumentFragment(ownerDocument);
    }
    get innerHTML() {
        return this.content.innerHTML;
    }
    set innerHTML(html) {
        this.content.innerHTML = html;
    }
    cloneNode(deep) {
        const cloned = new MockTemplateElement(null);
        cloned.attributes = cloneAttributes(this.attributes);
        const styleCssText = this.getAttribute('style');
        if (styleCssText != null && styleCssText.length > 0) {
            cloned.setAttribute('style', styleCssText);
        }
        cloned.content = this.content.cloneNode(deep);
        if (deep) {
            for (let i = 0, ii = this.childNodes.length; i < ii; i++) {
                const clonedChildNode = this.childNodes[i].cloneNode(true);
                cloned.appendChild(clonedChildNode);
            }
        }
        return cloned;
    }
}
class MockTitleElement extends MockHTMLElement {
    constructor(ownerDocument) {
        super(ownerDocument, 'title');
    }
    get text() {
        return this.textContent;
    }
    set text(value) {
        this.textContent = value;
    }
}
class MockUListElement extends MockHTMLElement {
    constructor(ownerDocument) {
        super(ownerDocument, 'ul');
    }
}
class MockCanvasElement extends MockHTMLElement {
    constructor(ownerDocument) {
        super(ownerDocument, 'canvas');
    }
    getContext() {
        return {
            fillRect() {
                return;
            },
            clearRect() { },
            getImageData: function (_, __, w, h) {
                return {
                    data: new Array(w * h * 4),
                };
            },
            putImageData() { },
            createImageData: function () {
                return [];
            },
            setTransform() { },
            drawImage() { },
            save() { },
            fillText() { },
            restore() { },
            beginPath() { },
            moveTo() { },
            lineTo() { },
            closePath() { },
            stroke() { },
            translate() { },
            scale() { },
            rotate() { },
            arc() { },
            fill() { },
            measureText() {
                return { width: 0 };
            },
            transform() { },
            rect() { },
            clip() { },
        };
    }
}
function fullUrl(elm, attrName) {
    const val = elm.getAttribute(attrName) || '';
    if (elm.ownerDocument != null) {
        const win = elm.ownerDocument.defaultView;
        if (win != null) {
            const loc = win.location;
            if (loc != null) {
                try {
                    const url = new URL(val, loc.href);
                    return url.href;
                }
                catch (e) { }
            }
        }
    }
    return val.replace(/\'|\"/g, '').trim();
}
function patchPropAttributes(prototype, attrs, defaults = {}) {
    Object.keys(attrs).forEach((propName) => {
        const attr = attrs[propName];
        const defaultValue = defaults[propName];
        if (attr === Boolean) {
            Object.defineProperty(prototype, propName, {
                get() {
                    return this.hasAttribute(propName);
                },
                set(value) {
                    if (value) {
                        this.setAttribute(propName, '');
                    }
                    else {
                        this.removeAttribute(propName);
                    }
                },
            });
        }
        else if (attr === Number) {
            Object.defineProperty(prototype, propName, {
                get() {
                    const value = this.getAttribute(propName);
                    return value ? parseInt(value, 10) : defaultValue === undefined ? 0 : defaultValue;
                },
                set(value) {
                    this.setAttribute(propName, value);
                },
            });
        }
        else {
            Object.defineProperty(prototype, propName, {
                get() {
                    return this.hasAttribute(propName) ? this.getAttribute(propName) : defaultValue || '';
                },
                set(value) {
                    this.setAttribute(propName, value);
                },
            });
        }
    });
}
MockElement.prototype.cloneNode = function (deep) {
    // because we're creating elements, which extending specific HTML base classes there
    // is a MockElement circular reference that bundling has trouble dealing with so
    // the fix is to add cloneNode() to MockElement's prototype after the HTML classes
    const cloned = createElement(this.ownerDocument, this.nodeName);
    cloned.attributes = cloneAttributes(this.attributes);
    const styleCssText = this.getAttribute('style');
    if (styleCssText != null && styleCssText.length > 0) {
        cloned.setAttribute('style', styleCssText);
    }
    if (deep) {
        for (let i = 0, ii = this.childNodes.length; i < ii; i++) {
            const clonedChildNode = this.childNodes[i].cloneNode(true);
            cloned.appendChild(clonedChildNode);
        }
    }
    return cloned;
};

let sharedDocument;
function parseHtmlToDocument(html, ownerDocument = null) {
    if (ownerDocument == null) {
        if (sharedDocument == null) {
            sharedDocument = new MockDocument();
        }
        ownerDocument = sharedDocument;
    }
    return parseDocumentUtil(ownerDocument, html);
}
function parseHtmlToFragment(html, ownerDocument = null) {
    if (ownerDocument == null) {
        if (sharedDocument == null) {
            sharedDocument = new MockDocument();
        }
        ownerDocument = sharedDocument;
    }
    return parseFragmentUtil(ownerDocument, html);
}

const consoleNoop = () => {
    /**/
};
function createConsole() {
    return {
        debug: consoleNoop,
        error: consoleNoop,
        info: consoleNoop,
        log: consoleNoop,
        warn: consoleNoop,
        dir: consoleNoop,
        dirxml: consoleNoop,
        table: consoleNoop,
        trace: consoleNoop,
        group: consoleNoop,
        groupCollapsed: consoleNoop,
        groupEnd: consoleNoop,
        clear: consoleNoop,
        count: consoleNoop,
        countReset: consoleNoop,
        assert: consoleNoop,
        profile: consoleNoop,
        profileEnd: consoleNoop,
        time: consoleNoop,
        timeLog: consoleNoop,
        timeEnd: consoleNoop,
        timeStamp: consoleNoop,
        context: consoleNoop,
        memory: consoleNoop,
    };
}

class MockHeaders {
    constructor(init) {
        this._values = [];
        if (typeof init === 'object') {
            if (typeof init[Symbol.iterator] === 'function') {
                const kvs = [];
                for (const kv of init) {
                    if (typeof kv[Symbol.iterator] === 'function') {
                        kvs.push([...kv]);
                    }
                }
                for (const kv of kvs) {
                    this.append(kv[0], kv[1]);
                }
            }
            else {
                for (const key in init) {
                    this.append(key, init[key]);
                }
            }
        }
    }
    append(key, value) {
        this._values.push([key, value + '']);
    }
    delete(key) {
        key = key.toLowerCase();
        for (let i = this._values.length - 1; i >= 0; i--) {
            if (this._values[i][0].toLowerCase() === key) {
                this._values.splice(i, 1);
            }
        }
    }
    entries() {
        const entries = [];
        for (const kv of this.keys()) {
            entries.push([kv, this.get(kv)]);
        }
        let index = -1;
        return {
            next() {
                index++;
                return {
                    value: entries[index],
                    done: !entries[index],
                };
            },
            [Symbol.iterator]() {
                return this;
            },
        };
    }
    forEach(cb) {
        for (const kv of this.entries()) {
            cb(kv[1], kv[0]);
        }
    }
    get(key) {
        const rtn = [];
        key = key.toLowerCase();
        for (const kv of this._values) {
            if (kv[0].toLowerCase() === key) {
                rtn.push(kv[1]);
            }
        }
        return rtn.length > 0 ? rtn.join(', ') : null;
    }
    has(key) {
        key = key.toLowerCase();
        for (const kv of this._values) {
            if (kv[0].toLowerCase() === key) {
                return true;
            }
        }
        return false;
    }
    keys() {
        const keys = [];
        for (const kv of this._values) {
            const key = kv[0].toLowerCase();
            if (!keys.includes(key)) {
                keys.push(key);
            }
        }
        let index = -1;
        return {
            next() {
                index++;
                return {
                    value: keys[index],
                    done: !keys[index],
                };
            },
            [Symbol.iterator]() {
                return this;
            },
        };
    }
    set(key, value) {
        for (const kv of this._values) {
            if (kv[0].toLowerCase() === key.toLowerCase()) {
                kv[1] = value + '';
                return;
            }
        }
        this.append(key, value);
    }
    values() {
        const values = this._values;
        let index = -1;
        return {
            next() {
                index++;
                const done = !values[index];
                return {
                    value: done ? undefined : values[index][1],
                    done,
                };
            },
            [Symbol.iterator]() {
                return this;
            },
        };
    }
    [Symbol.iterator]() {
        return this.entries();
    }
}

class MockDOMParser {
    parseFromString(htmlToParse, mimeType) {
        if (mimeType !== 'text/html') {
            console.error('XML parsing not implemented yet, continuing as html');
        }
        return parseHtmlToDocument(htmlToParse);
    }
}

class MockRequest {
    constructor(input, init = {}) {
        this._method = 'GET';
        this._url = '/';
        this.bodyUsed = false;
        this.cache = 'default';
        this.credentials = 'same-origin';
        this.integrity = '';
        this.keepalive = false;
        this.mode = 'cors';
        this.redirect = 'follow';
        this.referrer = 'about:client';
        this.referrerPolicy = '';
        if (typeof input === 'string') {
            this.url = input;
        }
        else if (input) {
            Object.assign(this, input);
            this.headers = new MockHeaders(input.headers);
        }
        Object.assign(this, init);
        if (init.headers) {
            this.headers = new MockHeaders(init.headers);
        }
        if (!this.headers) {
            this.headers = new MockHeaders();
        }
    }
    get url() {
        if (typeof this._url === 'string') {
            return new URL(this._url, location.href).href;
        }
        return new URL('/', location.href).href;
    }
    set url(value) {
        this._url = value;
    }
    get method() {
        if (typeof this._method === 'string') {
            return this._method.toUpperCase();
        }
        return 'GET';
    }
    set method(value) {
        this._method = value;
    }
    clone() {
        const clone = { ...this };
        clone.headers = new MockHeaders(this.headers);
        return new MockRequest(clone);
    }
}
class MockResponse {
    constructor(body, init = {}) {
        this.ok = true;
        this.status = 200;
        this.statusText = '';
        this.type = 'default';
        this.url = '';
        this._body = body;
        if (init) {
            Object.assign(this, init);
        }
        this.headers = new MockHeaders(init.headers);
    }
    async json() {
        return JSON.parse(this._body);
    }
    async text() {
        return this._body;
    }
    clone() {
        const initClone = { ...this };
        initClone.headers = new MockHeaders(this.headers);
        return new MockResponse(this._body, initClone);
    }
}

function setupGlobal(gbl) {
    if (gbl.window == null) {
        const win = (gbl.window = new MockWindow());
        WINDOW_FUNCTIONS.forEach((fnName) => {
            if (!(fnName in gbl)) {
                gbl[fnName] = win[fnName].bind(win);
            }
        });
        WINDOW_PROPS.forEach((propName) => {
            if (!(propName in gbl)) {
                Object.defineProperty(gbl, propName, {
                    get() {
                        return win[propName];
                    },
                    set(val) {
                        win[propName] = val;
                    },
                    configurable: true,
                    enumerable: true,
                });
            }
        });
        GLOBAL_CONSTRUCTORS.forEach(([cstrName]) => {
            gbl[cstrName] = win[cstrName];
        });
    }
    return gbl.window;
}
function teardownGlobal(gbl) {
    const win = gbl.window;
    if (win && typeof win.close === 'function') {
        win.close();
    }
}
function patchWindow(winToBePatched) {
    const mockWin = new MockWindow(false);
    WINDOW_FUNCTIONS.forEach((fnName) => {
        if (typeof winToBePatched[fnName] !== 'function') {
            winToBePatched[fnName] = mockWin[fnName].bind(mockWin);
        }
    });
    WINDOW_PROPS.forEach((propName) => {
        if (winToBePatched === undefined) {
            Object.defineProperty(winToBePatched, propName, {
                get() {
                    return mockWin[propName];
                },
                set(val) {
                    mockWin[propName] = val;
                },
                configurable: true,
                enumerable: true,
            });
        }
    });
}
function addGlobalsToWindowPrototype(mockWinPrototype) {
    GLOBAL_CONSTRUCTORS.forEach(([cstrName, Cstr]) => {
        Object.defineProperty(mockWinPrototype, cstrName, {
            get() {
                return this['__' + cstrName] || Cstr;
            },
            set(cstr) {
                this['__' + cstrName] = cstr;
            },
            configurable: true,
            enumerable: true,
        });
    });
}
const WINDOW_FUNCTIONS = [
    'addEventListener',
    'alert',
    'blur',
    'cancelAnimationFrame',
    'cancelIdleCallback',
    'clearInterval',
    'clearTimeout',
    'close',
    'confirm',
    'dispatchEvent',
    'focus',
    'getComputedStyle',
    'matchMedia',
    'open',
    'prompt',
    'removeEventListener',
    'requestAnimationFrame',
    'requestIdleCallback',
    'URL',
];
const WINDOW_PROPS = [
    'customElements',
    'devicePixelRatio',
    'document',
    'history',
    'innerHeight',
    'innerWidth',
    'localStorage',
    'location',
    'navigator',
    'pageXOffset',
    'pageYOffset',
    'performance',
    'screenLeft',
    'screenTop',
    'screenX',
    'screenY',
    'scrollX',
    'scrollY',
    'sessionStorage',
    'CSS',
    'CustomEvent',
    'Event',
    'Element',
    'HTMLElement',
    'Node',
    'NodeList',
    'FocusEvent',
    'KeyboardEvent',
    'MouseEvent',
];
const GLOBAL_CONSTRUCTORS = [
    ['CustomEvent', MockCustomEvent],
    ['Event', MockEvent],
    ['Headers', MockHeaders],
    ['FocusEvent', MockFocusEvent],
    ['KeyboardEvent', MockKeyboardEvent],
    ['MouseEvent', MockMouseEvent],
    ['Request', MockRequest],
    ['Response', MockResponse],
    ['DOMParser', MockDOMParser],
    ['HTMLAnchorElement', MockAnchorElement],
    ['HTMLBaseElement', MockBaseElement],
    ['HTMLButtonElement', MockButtonElement],
    ['HTMLCanvasElement', MockCanvasElement],
    ['HTMLFormElement', MockFormElement],
    ['HTMLImageElement', MockImageElement],
    ['HTMLInputElement', MockInputElement],
    ['HTMLLinkElement', MockLinkElement],
    ['HTMLMetaElement', MockMetaElement],
    ['HTMLScriptElement', MockScriptElement],
    ['HTMLStyleElement', MockStyleElement],
    ['HTMLTemplateElement', MockTemplateElement],
    ['HTMLTitleElement', MockTitleElement],
    ['HTMLUListElement', MockUListElement],
];

class MockHistory {
    constructor() {
        this.items = [];
    }
    get length() {
        return this.items.length;
    }
    back() {
        this.go(-1);
    }
    forward() {
        this.go(1);
    }
    go(_value) {
        //
    }
    pushState(_state, _title, _url) {
        //
    }
    replaceState(_state, _title, _url) {
        //
    }
}

class MockIntersectionObserver {
    constructor() {
        /**/
    }
    disconnect() {
        /**/
    }
    observe() {
        /**/
    }
    takeRecords() {
        return [];
    }
    unobserve() {
        /**/
    }
}

class MockLocation {
    constructor() {
        this.ancestorOrigins = null;
        this.protocol = '';
        this.host = '';
        this.hostname = '';
        this.port = '';
        this.pathname = '';
        this.search = '';
        this.hash = '';
        this.username = '';
        this.password = '';
        this.origin = '';
        this._href = '';
    }
    get href() {
        return this._href;
    }
    set href(value) {
        const url = new URL(value, 'http://mockdoc.stenciljs.com');
        this._href = url.href;
        this.protocol = url.protocol;
        this.host = url.host;
        this.hostname = url.hostname;
        this.port = url.port;
        this.pathname = url.pathname;
        this.search = url.search;
        this.hash = url.hash;
        this.username = url.username;
        this.password = url.password;
        this.origin = url.origin;
    }
    assign(_url) {
        //
    }
    reload(_forcedReload) {
        //
    }
    replace(_url) {
        //
    }
    toString() {
        return this.href;
    }
}

class MockNavigator {
    constructor() {
        this.appCodeName = 'MockNavigator';
        this.appName = 'MockNavigator';
        this.appVersion = 'MockNavigator';
        this.platform = 'MockNavigator';
        this.userAgent = 'MockNavigator';
    }
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/Performance
 */
class MockPerformance {
    constructor() {
        this.timeOrigin = Date.now();
        this.eventCounts = new Map();
    }
    addEventListener() {
        //
    }
    clearMarks() {
        //
    }
    clearMeasures() {
        //
    }
    clearResourceTimings() {
        //
    }
    dispatchEvent() {
        return true;
    }
    getEntries() {
        return [];
    }
    getEntriesByName() {
        return [];
    }
    getEntriesByType() {
        return [];
    }
    // Stencil's implementation of `mark` is non-compliant with the `Performance` interface. Because Stencil will
    // instantiate an instance of this class and may attempt to assign it to a variable of type `Performance`, the return
    // type must match the `Performance` interface (rather than typing this function as returning `void` and ignoring the
    // associated errors returned by the type checker)
    // @ts-ignore
    mark() {
        //
    }
    // Stencil's implementation of `measure` is non-compliant with the `Performance` interface. Because Stencil will
    // instantiate an instance of this class and may attempt to assign it to a variable of type `Performance`, the return
    // type must match the `Performance` interface (rather than typing this function as returning `void` and ignoring the
    // associated errors returned by the type checker)
    // @ts-ignore
    measure() {
        //
    }
    get navigation() {
        return {};
    }
    now() {
        return Date.now() - this.timeOrigin;
    }
    get onresourcetimingbufferfull() {
        return null;
    }
    removeEventListener() {
        //
    }
    setResourceTimingBufferSize() {
        //
    }
    get timing() {
        return {};
    }
    toJSON() {
        //
    }
}
function resetPerformance(perf) {
    if (perf != null) {
        try {
            perf.timeOrigin = Date.now();
        }
        catch (e) { }
    }
}

class MockStorage {
    constructor() {
        this.items = new Map();
    }
    key(_value) {
        //
    }
    getItem(key) {
        key = String(key);
        if (this.items.has(key)) {
            return this.items.get(key);
        }
        return null;
    }
    setItem(key, value) {
        if (value == null) {
            value = 'null';
        }
        this.items.set(String(key), String(value));
    }
    removeItem(key) {
        this.items.delete(String(key));
    }
    clear() {
        this.items.clear();
    }
}

const nativeClearInterval = clearInterval;
const nativeClearTimeout = clearTimeout;
const nativeSetInterval = setInterval;
const nativeSetTimeout = setTimeout;
const nativeURL = URL;
class MockWindow {
    constructor(html = null) {
        if (html !== false) {
            this.document = new MockDocument(html, this);
        }
        else {
            this.document = null;
        }
        this.performance = new MockPerformance();
        this.customElements = new MockCustomElementRegistry(this);
        this.console = createConsole();
        resetWindowDefaults(this);
        resetWindowDimensions(this);
    }
    addEventListener(type, handler) {
        addEventListener(this, type, handler);
    }
    alert(msg) {
        if (this.console) {
            this.console.debug(msg);
        }
        else {
            console.debug(msg);
        }
    }
    blur() {
        /**/
    }
    cancelAnimationFrame(id) {
        this.__clearTimeout(id);
    }
    cancelIdleCallback(id) {
        this.__clearTimeout(id);
    }
    get CharacterData() {
        if (this.__charDataCstr == null) {
            const ownerDocument = this.document;
            this.__charDataCstr = class extends MockNode {
                constructor() {
                    super(ownerDocument, 0, 'test', '');
                    throw new Error('Illegal constructor: cannot construct CharacterData');
                }
            };
        }
        return this.__charDataCstr;
    }
    set CharacterData(charDataCstr) {
        this.__charDataCstr = charDataCstr;
    }
    clearInterval(id) {
        this.__clearInterval(id);
    }
    clearTimeout(id) {
        this.__clearTimeout(id);
    }
    close() {
        resetWindow(this);
    }
    confirm() {
        return false;
    }
    get CSS() {
        return {
            supports: () => true,
        };
    }
    get Document() {
        if (this.__docCstr == null) {
            const win = this;
            this.__docCstr = class extends MockDocument {
                constructor() {
                    super(false, win);
                    throw new Error('Illegal constructor: cannot construct Document');
                }
            };
        }
        return this.__docCstr;
    }
    set Document(docCstr) {
        this.__docCstr = docCstr;
    }
    get DocumentFragment() {
        if (this.__docFragCstr == null) {
            const ownerDocument = this.document;
            this.__docFragCstr = class extends MockDocumentFragment {
                constructor() {
                    super(ownerDocument);
                    throw new Error('Illegal constructor: cannot construct DocumentFragment');
                }
            };
        }
        return this.__docFragCstr;
    }
    set DocumentFragment(docFragCstr) {
        this.__docFragCstr = docFragCstr;
    }
    get DocumentType() {
        if (this.__docTypeCstr == null) {
            const ownerDocument = this.document;
            this.__docTypeCstr = class extends MockNode {
                constructor() {
                    super(ownerDocument, 0, 'test', '');
                    throw new Error('Illegal constructor: cannot construct DocumentType');
                }
            };
        }
        return this.__docTypeCstr;
    }
    set DocumentType(docTypeCstr) {
        this.__docTypeCstr = docTypeCstr;
    }
    get DOMTokenList() {
        if (this.__domTokenListCstr == null) {
            this.__domTokenListCstr = class MockDOMTokenList {
            };
        }
        return this.__domTokenListCstr;
    }
    set DOMTokenList(domTokenListCstr) {
        this.__domTokenListCstr = domTokenListCstr;
    }
    dispatchEvent(ev) {
        return dispatchEvent(this, ev);
    }
    get Element() {
        if (this.__elementCstr == null) {
            const ownerDocument = this.document;
            this.__elementCstr = class extends MockElement {
                constructor() {
                    super(ownerDocument, '');
                    throw new Error('Illegal constructor: cannot construct Element');
                }
            };
        }
        return this.__elementCstr;
    }
    fetch(input, init) {
        if (typeof fetch === 'function') {
            return fetch(input, init);
        }
        throw new Error(`fetch() not implemented`);
    }
    focus() {
        /**/
    }
    getComputedStyle(_) {
        return {
            cssText: '',
            length: 0,
            parentRule: null,
            getPropertyPriority() {
                return null;
            },
            getPropertyValue() {
                return '';
            },
            item() {
                return null;
            },
            removeProperty() {
                return null;
            },
            setProperty() {
                return null;
            },
        };
    }
    get globalThis() {
        return this;
    }
    get history() {
        if (this.__history == null) {
            this.__history = new MockHistory();
        }
        return this.__history;
    }
    set history(hsty) {
        this.__history = hsty;
    }
    get JSON() {
        return JSON;
    }
    get HTMLElement() {
        if (this.__htmlElementCstr == null) {
            const ownerDocument = this.document;
            this.__htmlElementCstr = class extends MockHTMLElement {
                constructor() {
                    super(ownerDocument, '');
                    const observedAttributes = this.constructor.observedAttributes;
                    if (Array.isArray(observedAttributes) && typeof this.attributeChangedCallback === 'function') {
                        observedAttributes.forEach((attrName) => {
                            const attrValue = this.getAttribute(attrName);
                            if (attrValue != null) {
                                this.attributeChangedCallback(attrName, null, attrValue);
                            }
                        });
                    }
                }
            };
        }
        return this.__htmlElementCstr;
    }
    set HTMLElement(htmlElementCstr) {
        this.__htmlElementCstr = htmlElementCstr;
    }
    get IntersectionObserver() {
        return MockIntersectionObserver;
    }
    get localStorage() {
        if (this.__localStorage == null) {
            this.__localStorage = new MockStorage();
        }
        return this.__localStorage;
    }
    set localStorage(locStorage) {
        this.__localStorage = locStorage;
    }
    get location() {
        if (this.__location == null) {
            this.__location = new MockLocation();
        }
        return this.__location;
    }
    set location(val) {
        if (typeof val === 'string') {
            if (this.__location == null) {
                this.__location = new MockLocation();
            }
            this.__location.href = val;
        }
        else {
            this.__location = val;
        }
    }
    matchMedia(media) {
        return {
            media,
            matches: false,
            addListener: (_handler) => { },
            removeListener: (_handler) => { },
            addEventListener: (_type, _handler) => { },
            removeEventListener: (_type, _handler) => { },
            dispatchEvent: (_ev) => { },
            onchange: null,
        };
    }
    get Node() {
        if (this.__nodeCstr == null) {
            const ownerDocument = this.document;
            this.__nodeCstr = class extends MockNode {
                constructor() {
                    super(ownerDocument, 0, 'test', '');
                    throw new Error('Illegal constructor: cannot construct Node');
                }
            };
        }
        return this.__nodeCstr;
    }
    get NodeList() {
        if (this.__nodeListCstr == null) {
            const ownerDocument = this.document;
            this.__nodeListCstr = class extends MockNodeList {
                constructor() {
                    super(ownerDocument, [], 0);
                    throw new Error('Illegal constructor: cannot construct NodeList');
                }
            };
        }
        return this.__nodeListCstr;
    }
    get navigator() {
        if (this.__navigator == null) {
            this.__navigator = new MockNavigator();
        }
        return this.__navigator;
    }
    set navigator(nav) {
        this.__navigator = nav;
    }
    get parent() {
        return null;
    }
    prompt() {
        return '';
    }
    open() {
        return null;
    }
    get origin() {
        return this.location.origin;
    }
    removeEventListener(type, handler) {
        removeEventListener(this, type, handler);
    }
    requestAnimationFrame(callback) {
        return this.setTimeout(() => {
            callback(Date.now());
        }, 0);
    }
    requestIdleCallback(callback) {
        return this.setTimeout(() => {
            callback({
                didTimeout: false,
                timeRemaining: () => 0,
            });
        }, 0);
    }
    scroll(_x, _y) {
        /**/
    }
    scrollBy(_x, _y) {
        /**/
    }
    scrollTo(_x, _y) {
        /**/
    }
    get self() {
        return this;
    }
    get sessionStorage() {
        if (this.__sessionStorage == null) {
            this.__sessionStorage = new MockStorage();
        }
        return this.__sessionStorage;
    }
    set sessionStorage(locStorage) {
        this.__sessionStorage = locStorage;
    }
    setInterval(callback, ms, ...args) {
        if (this.__timeouts == null) {
            this.__timeouts = new Set();
        }
        ms = Math.min(ms, this.__maxTimeout);
        if (this.__allowInterval) {
            const intervalId = this.__setInterval(() => {
                if (this.__timeouts) {
                    this.__timeouts.delete(intervalId);
                    try {
                        callback(...args);
                    }
                    catch (e) {
                        if (this.console) {
                            this.console.error(e);
                        }
                        else {
                            console.error(e);
                        }
                    }
                }
            }, ms);
            if (this.__timeouts) {
                this.__timeouts.add(intervalId);
            }
            return intervalId;
        }
        const timeoutId = this.__setTimeout(() => {
            if (this.__timeouts) {
                this.__timeouts.delete(timeoutId);
                try {
                    callback(...args);
                }
                catch (e) {
                    if (this.console) {
                        this.console.error(e);
                    }
                    else {
                        console.error(e);
                    }
                }
            }
        }, ms);
        if (this.__timeouts) {
            this.__timeouts.add(timeoutId);
        }
        return timeoutId;
    }
    setTimeout(callback, ms, ...args) {
        if (this.__timeouts == null) {
            this.__timeouts = new Set();
        }
        ms = Math.min(ms, this.__maxTimeout);
        const timeoutId = this.__setTimeout(() => {
            if (this.__timeouts) {
                this.__timeouts.delete(timeoutId);
                try {
                    callback(...args);
                }
                catch (e) {
                    if (this.console) {
                        this.console.error(e);
                    }
                    else {
                        console.error(e);
                    }
                }
            }
        }, ms);
        if (this.__timeouts) {
            this.__timeouts.add(timeoutId);
        }
        return timeoutId;
    }
    get top() {
        return this;
    }
    get window() {
        return this;
    }
    onanimationstart() {
        /**/
    }
    onanimationend() {
        /**/
    }
    onanimationiteration() {
        /**/
    }
    onabort() {
        /**/
    }
    onauxclick() {
        /**/
    }
    onbeforecopy() {
        /**/
    }
    onbeforecut() {
        /**/
    }
    onbeforepaste() {
        /**/
    }
    onblur() {
        /**/
    }
    oncancel() {
        /**/
    }
    oncanplay() {
        /**/
    }
    oncanplaythrough() {
        /**/
    }
    onchange() {
        /**/
    }
    onclick() {
        /**/
    }
    onclose() {
        /**/
    }
    oncontextmenu() {
        /**/
    }
    oncopy() {
        /**/
    }
    oncuechange() {
        /**/
    }
    oncut() {
        /**/
    }
    ondblclick() {
        /**/
    }
    ondrag() {
        /**/
    }
    ondragend() {
        /**/
    }
    ondragenter() {
        /**/
    }
    ondragleave() {
        /**/
    }
    ondragover() {
        /**/
    }
    ondragstart() {
        /**/
    }
    ondrop() {
        /**/
    }
    ondurationchange() {
        /**/
    }
    onemptied() {
        /**/
    }
    onended() {
        /**/
    }
    onerror() {
        /**/
    }
    onfocus() {
        /**/
    }
    onfocusin() {
        /**/
    }
    onfocusout() {
        /**/
    }
    onformdata() {
        /**/
    }
    onfullscreenchange() {
        /**/
    }
    onfullscreenerror() {
        /**/
    }
    ongotpointercapture() {
        /**/
    }
    oninput() {
        /**/
    }
    oninvalid() {
        /**/
    }
    onkeydown() {
        /**/
    }
    onkeypress() {
        /**/
    }
    onkeyup() {
        /**/
    }
    onload() {
        /**/
    }
    onloadeddata() {
        /**/
    }
    onloadedmetadata() {
        /**/
    }
    onloadstart() {
        /**/
    }
    onlostpointercapture() {
        /**/
    }
    onmousedown() {
        /**/
    }
    onmouseenter() {
        /**/
    }
    onmouseleave() {
        /**/
    }
    onmousemove() {
        /**/
    }
    onmouseout() {
        /**/
    }
    onmouseover() {
        /**/
    }
    onmouseup() {
        /**/
    }
    onmousewheel() {
        /**/
    }
    onpaste() {
        /**/
    }
    onpause() {
        /**/
    }
    onplay() {
        /**/
    }
    onplaying() {
        /**/
    }
    onpointercancel() {
        /**/
    }
    onpointerdown() {
        /**/
    }
    onpointerenter() {
        /**/
    }
    onpointerleave() {
        /**/
    }
    onpointermove() {
        /**/
    }
    onpointerout() {
        /**/
    }
    onpointerover() {
        /**/
    }
    onpointerup() {
        /**/
    }
    onprogress() {
        /**/
    }
    onratechange() {
        /**/
    }
    onreset() {
        /**/
    }
    onresize() {
        /**/
    }
    onscroll() {
        /**/
    }
    onsearch() {
        /**/
    }
    onseeked() {
        /**/
    }
    onseeking() {
        /**/
    }
    onselect() {
        /**/
    }
    onselectstart() {
        /**/
    }
    onstalled() {
        /**/
    }
    onsubmit() {
        /**/
    }
    onsuspend() {
        /**/
    }
    ontimeupdate() {
        /**/
    }
    ontoggle() {
        /**/
    }
    onvolumechange() {
        /**/
    }
    onwaiting() {
        /**/
    }
    onwebkitfullscreenchange() {
        /**/
    }
    onwebkitfullscreenerror() {
        /**/
    }
    onwheel() {
        /**/
    }
}
addGlobalsToWindowPrototype(MockWindow.prototype);
function resetWindowDefaults(win) {
    win.__clearInterval = nativeClearInterval;
    win.__clearTimeout = nativeClearTimeout;
    win.__setInterval = nativeSetInterval;
    win.__setTimeout = nativeSetTimeout;
    win.__maxTimeout = 30000;
    win.__allowInterval = true;
    win.URL = nativeURL;
}
function cloneWindow(srcWin, opts = {}) {
    if (srcWin == null) {
        return null;
    }
    const clonedWin = new MockWindow(false);
    if (!opts.customElementProxy) {
        // TODO(STENCIL-345) - Evaluate reconciling MockWindow, Window differences
        // @ts-ignore
        srcWin.customElements = null;
    }
    if (srcWin.document != null) {
        const clonedDoc = new MockDocument(false, clonedWin);
        clonedWin.document = clonedDoc;
        clonedDoc.documentElement = srcWin.document.documentElement.cloneNode(true);
    }
    else {
        clonedWin.document = new MockDocument(null, clonedWin);
    }
    return clonedWin;
}
function cloneDocument(srcDoc) {
    if (srcDoc == null) {
        return null;
    }
    const dstWin = cloneWindow(srcDoc.defaultView);
    return dstWin.document;
}
// TODO(STENCIL-345) - Evaluate reconciling MockWindow, Window differences
/**
 * Constrain setTimeout() to 1ms, but still async. Also
 * only allow setInterval() to fire once, also constrained to 1ms.
 * @param win the mock window instance to update
 */
function constrainTimeouts(win) {
    win.__allowInterval = false;
    win.__maxTimeout = 0;
}
function resetWindow(win) {
    if (win != null) {
        if (win.__timeouts) {
            win.__timeouts.forEach((timeoutId) => {
                nativeClearInterval(timeoutId);
                nativeClearTimeout(timeoutId);
            });
            win.__timeouts.clear();
        }
        if (win.customElements && win.customElements.clear) {
            win.customElements.clear();
        }
        resetDocument(win.document);
        resetPerformance(win.performance);
        for (const key in win) {
            if (win.hasOwnProperty(key) && key !== 'document' && key !== 'performance' && key !== 'customElements') {
                delete win[key];
            }
        }
        resetWindowDefaults(win);
        resetWindowDimensions(win);
        resetEventListeners(win);
        if (win.document != null) {
            try {
                win.document.defaultView = win;
            }
            catch (e) { }
        }
        // ensure we don't hold onto nodeFetch values
        win.fetch = null;
        win.Headers = null;
        win.Request = null;
        win.Response = null;
        win.FetchError = null;
    }
}
function resetWindowDimensions(win) {
    try {
        win.devicePixelRatio = 1;
        win.innerHeight = 768;
        win.innerWidth = 1366;
        win.pageXOffset = 0;
        win.pageYOffset = 0;
        win.screenLeft = 0;
        win.screenTop = 0;
        win.screenX = 0;
        win.screenY = 0;
        win.scrollX = 0;
        win.scrollY = 0;
        win.screen = {
            availHeight: win.innerHeight,
            availLeft: 0,
            availTop: 0,
            availWidth: win.innerWidth,
            colorDepth: 24,
            height: win.innerHeight,
            keepAwake: false,
            orientation: {
                angle: 0,
                type: 'portrait-primary',
            },
            pixelDepth: 24,
            width: win.innerWidth,
        };
    }
    catch (e) { }
}

class MockDocument extends MockHTMLElement {
    constructor(html = null, win = null) {
        super(null, null);
        this.nodeName = "#document" /* NODE_NAMES.DOCUMENT_NODE */;
        this.nodeType = 9 /* NODE_TYPES.DOCUMENT_NODE */;
        this.defaultView = win;
        this.cookie = '';
        this.referrer = '';
        this.appendChild(this.createDocumentTypeNode());
        if (typeof html === 'string') {
            const parsedDoc = parseDocumentUtil(this, html);
            const documentElement = parsedDoc.children.find((elm) => elm.nodeName === 'HTML');
            if (documentElement != null) {
                this.appendChild(documentElement);
                setOwnerDocument(documentElement, this);
            }
        }
        else if (html !== false) {
            const documentElement = new MockHTMLElement(this, 'html');
            this.appendChild(documentElement);
            documentElement.appendChild(new MockHTMLElement(this, 'head'));
            documentElement.appendChild(new MockHTMLElement(this, 'body'));
        }
    }
    get dir() {
        return this.documentElement.dir;
    }
    set dir(value) {
        this.documentElement.dir = value;
    }
    get location() {
        if (this.defaultView != null) {
            return this.defaultView.location;
        }
        return null;
    }
    set location(val) {
        if (this.defaultView != null) {
            this.defaultView.location = val;
        }
    }
    get baseURI() {
        const baseNode = this.head.childNodes.find((node) => node.nodeName === 'BASE');
        if (baseNode) {
            return baseNode.href;
        }
        return this.URL;
    }
    get URL() {
        return this.location.href;
    }
    get styleSheets() {
        return this.querySelectorAll('style');
    }
    get scripts() {
        return this.querySelectorAll('script');
    }
    get forms() {
        return this.querySelectorAll('form');
    }
    get images() {
        return this.querySelectorAll('img');
    }
    get scrollingElement() {
        return this.documentElement;
    }
    get documentElement() {
        for (let i = this.childNodes.length - 1; i >= 0; i--) {
            if (this.childNodes[i].nodeName === 'HTML') {
                return this.childNodes[i];
            }
        }
        const documentElement = new MockHTMLElement(this, 'html');
        this.appendChild(documentElement);
        return documentElement;
    }
    set documentElement(documentElement) {
        for (let i = this.childNodes.length - 1; i >= 0; i--) {
            if (this.childNodes[i].nodeType !== 10 /* NODE_TYPES.DOCUMENT_TYPE_NODE */) {
                this.childNodes[i].remove();
            }
        }
        if (documentElement != null) {
            this.appendChild(documentElement);
            setOwnerDocument(documentElement, this);
        }
    }
    get head() {
        const documentElement = this.documentElement;
        for (let i = 0; i < documentElement.childNodes.length; i++) {
            if (documentElement.childNodes[i].nodeName === 'HEAD') {
                return documentElement.childNodes[i];
            }
        }
        const head = new MockHTMLElement(this, 'head');
        documentElement.insertBefore(head, documentElement.firstChild);
        return head;
    }
    set head(head) {
        const documentElement = this.documentElement;
        for (let i = documentElement.childNodes.length - 1; i >= 0; i--) {
            if (documentElement.childNodes[i].nodeName === 'HEAD') {
                documentElement.childNodes[i].remove();
            }
        }
        if (head != null) {
            documentElement.insertBefore(head, documentElement.firstChild);
            setOwnerDocument(head, this);
        }
    }
    get body() {
        const documentElement = this.documentElement;
        for (let i = documentElement.childNodes.length - 1; i >= 0; i--) {
            if (documentElement.childNodes[i].nodeName === 'BODY') {
                return documentElement.childNodes[i];
            }
        }
        const body = new MockHTMLElement(this, 'body');
        documentElement.appendChild(body);
        return body;
    }
    set body(body) {
        const documentElement = this.documentElement;
        for (let i = documentElement.childNodes.length - 1; i >= 0; i--) {
            if (documentElement.childNodes[i].nodeName === 'BODY') {
                documentElement.childNodes[i].remove();
            }
        }
        if (body != null) {
            documentElement.appendChild(body);
            setOwnerDocument(body, this);
        }
    }
    appendChild(newNode) {
        newNode.remove();
        newNode.parentNode = this;
        this.childNodes.push(newNode);
        return newNode;
    }
    createComment(data) {
        return new MockComment(this, data);
    }
    createAttribute(attrName) {
        return new MockAttr(attrName.toLowerCase(), '');
    }
    createAttributeNS(namespaceURI, attrName) {
        return new MockAttr(attrName, '', namespaceURI);
    }
    createElement(tagName) {
        if (tagName === "#document" /* NODE_NAMES.DOCUMENT_NODE */) {
            const doc = new MockDocument(false);
            doc.nodeName = tagName;
            doc.parentNode = null;
            return doc;
        }
        return createElement(this, tagName);
    }
    createElementNS(namespaceURI, tagName) {
        const elmNs = createElementNS(this, namespaceURI, tagName);
        return elmNs;
    }
    createTextNode(text) {
        return new MockTextNode(this, text);
    }
    createDocumentFragment() {
        return new MockDocumentFragment(this);
    }
    createDocumentTypeNode() {
        return new MockDocumentTypeNode(this);
    }
    getElementById(id) {
        return getElementById(this, id);
    }
    getElementsByName(elmName) {
        return getElementsByName(this, elmName.toLowerCase());
    }
    get title() {
        const title = this.head.childNodes.find((elm) => elm.nodeName === 'TITLE');
        if (title != null && typeof title.textContent === 'string') {
            return title.textContent.trim();
        }
        return '';
    }
    set title(value) {
        const head = this.head;
        let title = head.childNodes.find((elm) => elm.nodeName === 'TITLE');
        if (title == null) {
            title = this.createElement('title');
            head.appendChild(title);
        }
        title.textContent = value;
    }
}
function createDocument(html = null) {
    return new MockWindow(html).document;
}
function createFragment(html) {
    return parseHtmlToFragment(html, null);
}
function resetDocument(doc) {
    if (doc != null) {
        resetEventListeners(doc);
        const documentElement = doc.documentElement;
        if (documentElement != null) {
            resetElement(documentElement);
            for (let i = 0, ii = documentElement.childNodes.length; i < ii; i++) {
                const childNode = documentElement.childNodes[i];
                resetElement(childNode);
                childNode.childNodes.length = 0;
            }
        }
        for (const key in doc) {
            if (doc.hasOwnProperty(key) && !DOC_KEY_KEEPERS.has(key)) {
                delete doc[key];
            }
        }
        try {
            doc.nodeName = "#document" /* NODE_NAMES.DOCUMENT_NODE */;
        }
        catch (e) { }
        try {
            doc.nodeType = 9 /* NODE_TYPES.DOCUMENT_NODE */;
        }
        catch (e) { }
        try {
            doc.cookie = '';
        }
        catch (e) { }
        try {
            doc.referrer = '';
        }
        catch (e) { }
    }
}
const DOC_KEY_KEEPERS = new Set([
    'nodeName',
    'nodeType',
    'nodeValue',
    'ownerDocument',
    'parentNode',
    'childNodes',
    '_shadowRoot',
]);
function getElementById(elm, id) {
    const children = elm.children;
    for (let i = 0, ii = children.length; i < ii; i++) {
        const childElm = children[i];
        if (childElm.id === id) {
            return childElm;
        }
        const childElmFound = getElementById(childElm, id);
        if (childElmFound != null) {
            return childElmFound;
        }
    }
    return null;
}
function getElementsByName(elm, elmName, foundElms = []) {
    const children = elm.children;
    for (let i = 0, ii = children.length; i < ii; i++) {
        const childElm = children[i];
        if (childElm.name && childElm.name.toLowerCase() === elmName) {
            foundElms.push(childElm);
        }
        getElementsByName(childElm, elmName, foundElms);
    }
    return foundElms;
}
function setOwnerDocument(elm, ownerDocument) {
    for (let i = 0, ii = elm.childNodes.length; i < ii; i++) {
        elm.childNodes[i].ownerDocument = ownerDocument;
        if (elm.childNodes[i].nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */) {
            setOwnerDocument(elm.childNodes[i], ownerDocument);
        }
    }
}

function hydrateFactory($stencilWindow, $stencilHydrateOpts, $stencilHydrateResults, $stencilAfterHydrate, $stencilHydrateResolve) {
  var globalThis = $stencilWindow;
  var self = $stencilWindow;
  var top = $stencilWindow;
  var parent = $stencilWindow;

  var addEventListener = $stencilWindow.addEventListener.bind($stencilWindow);
  var alert = $stencilWindow.alert.bind($stencilWindow);
  var blur = $stencilWindow.blur.bind($stencilWindow);
  var cancelAnimationFrame = $stencilWindow.cancelAnimationFrame.bind($stencilWindow);
  var cancelIdleCallback = $stencilWindow.cancelIdleCallback.bind($stencilWindow);
  var clearInterval = $stencilWindow.clearInterval.bind($stencilWindow);
  var clearTimeout = $stencilWindow.clearTimeout.bind($stencilWindow);
  var close = () => {};
  var confirm = $stencilWindow.confirm.bind($stencilWindow);
  var dispatchEvent = $stencilWindow.dispatchEvent.bind($stencilWindow);
  var focus = $stencilWindow.focus.bind($stencilWindow);
  var getComputedStyle = $stencilWindow.getComputedStyle.bind($stencilWindow);
  var matchMedia = $stencilWindow.matchMedia.bind($stencilWindow);
  var open = $stencilWindow.open.bind($stencilWindow);
  var prompt = $stencilWindow.prompt.bind($stencilWindow);
  var removeEventListener = $stencilWindow.removeEventListener.bind($stencilWindow);
  var requestAnimationFrame = $stencilWindow.requestAnimationFrame.bind($stencilWindow);
  var requestIdleCallback = $stencilWindow.requestIdleCallback.bind($stencilWindow);
  var setInterval = $stencilWindow.setInterval.bind($stencilWindow);
  var setTimeout = $stencilWindow.setTimeout.bind($stencilWindow);

  var CharacterData = $stencilWindow.CharacterData;
  var CSS = $stencilWindow.CSS;
  var CustomEvent = $stencilWindow.CustomEvent;
  var Document = $stencilWindow.Document;
  var DocumentFragment = $stencilWindow.DocumentFragment;
  var DocumentType = $stencilWindow.DocumentType;
  var DOMTokenList = $stencilWindow.DOMTokenList;
  var Element = $stencilWindow.Element;
  var Event = $stencilWindow.Event;
  var HTMLAnchorElement = $stencilWindow.HTMLAnchorElement;
  var HTMLBaseElement = $stencilWindow.HTMLBaseElement;
  var HTMLButtonElement = $stencilWindow.HTMLButtonElement;
  var HTMLCanvasElement = $stencilWindow.HTMLCanvasElement;
  var HTMLElement = $stencilWindow.HTMLElement;
  var HTMLFormElement = $stencilWindow.HTMLFormElement;
  var HTMLImageElement = $stencilWindow.HTMLImageElement;
  var HTMLInputElement = $stencilWindow.HTMLInputElement;
  var HTMLLinkElement = $stencilWindow.HTMLLinkElement;
  var HTMLMetaElement = $stencilWindow.HTMLMetaElement;
  var HTMLScriptElement = $stencilWindow.HTMLScriptElement;
  var HTMLStyleElement = $stencilWindow.HTMLStyleElement;
  var HTMLTemplateElement = $stencilWindow.HTMLTemplateElement;
  var HTMLTitleElement = $stencilWindow.HTMLTitleElement;
  var IntersectionObserver = $stencilWindow.IntersectionObserver;
  var KeyboardEvent = $stencilWindow.KeyboardEvent;
  var MouseEvent = $stencilWindow.MouseEvent;
  var Node = $stencilWindow.Node;
  var NodeList = $stencilWindow.NodeList;
  var URL = $stencilWindow.URL;

  var console = $stencilWindow.console;
  var customElements = $stencilWindow.customElements;
  var history = $stencilWindow.history;
  var localStorage = $stencilWindow.localStorage;
  var location = $stencilWindow.location;
  var navigator = $stencilWindow.navigator;
  var performance = $stencilWindow.performance;
  var sessionStorage = $stencilWindow.sessionStorage;

  var devicePixelRatio = $stencilWindow.devicePixelRatio;
  var innerHeight = $stencilWindow.innerHeight;
  var innerWidth = $stencilWindow.innerWidth;
  var origin = $stencilWindow.origin;
  var pageXOffset = $stencilWindow.pageXOffset;
  var pageYOffset = $stencilWindow.pageYOffset;
  var screen = $stencilWindow.screen;
  var screenLeft = $stencilWindow.screenLeft;
  var screenTop = $stencilWindow.screenTop;
  var screenX = $stencilWindow.screenX;
  var screenY = $stencilWindow.screenY;
  var scrollX = $stencilWindow.scrollX;
  var scrollY = $stencilWindow.scrollY;
  var exports = {};

  var fetch, FetchError, Headers, Request, Response;

  if (typeof $stencilWindow.fetch === 'function') {
    fetch = $stencilWindow.fetch;
  } else {
    fetch = $stencilWindow.fetch = function() { throw new Error('fetch() is not implemented'); };
  }

  if (typeof $stencilWindow.FetchError === 'function') {
    FetchError = $stencilWindow.FetchError;
  } else {
    FetchError = $stencilWindow.FetchError = class FetchError { constructor() { throw new Error('FetchError is not implemented'); } };
  }

  if (typeof $stencilWindow.Headers === 'function') {
    Headers = $stencilWindow.Headers;
  } else {
    Headers = $stencilWindow.Headers = class Headers { constructor() { throw new Error('Headers is not implemented'); } };
  }

  if (typeof $stencilWindow.Request === 'function') {
    Request = $stencilWindow.Request;
  } else {
    Request = $stencilWindow.Request = class Request { constructor() { throw new Error('Request is not implemented'); } };
  }

  if (typeof $stencilWindow.Response === 'function') {
    Response = $stencilWindow.Response;
  } else {
    Response = $stencilWindow.Response = class Response { constructor() { throw new Error('Response is not implemented'); } };
  }

  function hydrateAppClosure($stencilWindow) {
    const window = $stencilWindow;
    const document = $stencilWindow.document;
    /*hydrateAppClosure start*/


const NAMESPACE = 'web-components';
const BUILD = /* web-components */ { allRenderFn: true, appendChildSlotFix: false, asyncLoading: true, attachStyles: true, cloneNodeFix: false, cmpDidLoad: false, cmpDidRender: true, cmpDidUnload: false, cmpDidUpdate: false, cmpShouldUpdate: false, cmpWillLoad: true, cmpWillRender: false, cmpWillUpdate: false, connectedCallback: false, constructableCSS: false, cssAnnotations: true, devTools: false, disconnectedCallback: false, element: false, event: false, experimentalScopedSlotChanges: false, experimentalSlotFixes: false, formAssociated: false, hasRenderFn: true, hostListener: false, hostListenerTarget: false, hostListenerTargetBody: false, hostListenerTargetDocument: false, hostListenerTargetParent: false, hostListenerTargetWindow: false, hotModuleReplacement: false, hydrateClientSide: true, hydrateServerSide: true, hydratedAttribute: false, hydratedClass: true, isDebug: false, isDev: false, isTesting: false, lazyLoad: true, lifecycle: true, lifecycleDOMEvents: false, member: true, method: false, mode: false, observeAttribute: true, profile: false, prop: true, propBoolean: true, propMutable: false, propNumber: false, propString: true, reflect: false, scoped: true, scriptDataOpts: false, shadowDelegatesFocus: false, shadowDom: true, shadowDomShim: true, slot: true, slotChildNodesFix: false, slotRelocation: true, state: true, style: true, svg: true, taskQueue: true, updatable: true, vdomAttribute: true, vdomClass: true, vdomFunctional: true, vdomKey: true, vdomListener: true, vdomPropOrAttr: true, vdomRef: true, vdomRender: true, vdomStyle: false, vdomText: true, vdomXlink: false, watchCallback: true };

function queryNonceMetaTagContent(e) {
 var t, o, n;
 return null !== (n = null === (o = null === (t = e.head) || void 0 === t ? void 0 : t.querySelector('meta[name="csp-nonce"]')) || void 0 === o ? void 0 : o.getAttribute("content")) && void 0 !== n ? n : void 0;
}

function componentOnReady() {
 return getHostRef(this).$onReadyPromise$;
}

function forceUpdate() {}

function hydrateApp(e, t, o, n, s) {
 function l() {
  if (global.clearTimeout(p), i.clear(), r.clear(), !h) {
   h = !0;
   try {
    t.clientHydrateAnnotations && insertVdomAnnotations(e.document, t.staticComponents), 
    e.dispatchEvent(new e.Event("DOMContentLoaded")), e.document.createElement = c, 
    e.document.createElementNS = $;
   } catch (e) {
    renderCatchError(t, o, e);
   }
  }
  n(e, t, o, s);
 }
 function a(e) {
  renderCatchError(t, o, e), l();
 }
 const r = new Set, i = new Set, d = new Set, c = e.document.createElement, $ = e.document.createElementNS, m = Promise.resolve();
 let p, h = !1;
 try {
  function f() {
   return L(this);
  }
  function u(e) {
   if (isValidComponent(e, t) && !getHostRef(e)) {
    const t = loadModule({
     $tagName$: e.nodeName.toLowerCase(),
     $flags$: null
    });
    null != t && null != t.cmpMeta && (i.add(e), e.connectedCallback = f, registerHost(e, t.cmpMeta), 
    function o(e, t) {
     if ("function" != typeof e.componentOnReady && (e.componentOnReady = componentOnReady), 
     "function" != typeof e.forceUpdate && (e.forceUpdate = forceUpdate), 1 & t.$flags$ && (e.shadowRoot = e), 
     null != t.$members$) {
      const o = getHostRef(e);
      Object.entries(t.$members$).forEach((([n, s]) => {
       const l = s[0];
       if (31 & l) {
        const a = s[1] || n, r = e.getAttribute(a);
        if (null != r) {
         const e = parsePropertyValue(r, l);
         o.$instanceValues$.set(n, e);
        }
        const i = e[n];
        void 0 !== i && (o.$instanceValues$.set(n, i), delete e[n]), Object.defineProperty(e, n, {
         get() {
          return getValue(this, n);
         },
         set(e) {
          setValue(this, n, e, t);
         },
         configurable: !0,
         enumerable: !0
        });
       } else 64 & l && Object.defineProperty(e, n, {
        value(...e) {
         const t = getHostRef(this);
         return t.$onInstancePromise$.then((() => t.$lazyInstance$[n](...e))).catch(consoleError);
        }
       });
      }));
     }
    }(e, t.cmpMeta));
   }
  }
  function g(e) {
   if (null != e && 1 === e.nodeType) {
    u(e);
    const t = e.children;
    for (let e = 0, o = t.length; e < o; e++) g(t[e]);
   }
  }
  function L(n) {
   return i.delete(n), isValidComponent(n, t) && o.hydratedCount < t.maxHydrateCount && !r.has(n) && shouldHydrate(n) ? (r.add(n), 
   async function s(e, t, o, n, l) {
    o = o.toLowerCase();
    const a = loadModule({
     $tagName$: o,
     $flags$: null
    });
    if (null != a && null != a.cmpMeta) {
     l.add(n);
     try {
      connectedCallback(n), await n.componentOnReady(), t.hydratedCount++;
      const e = getHostRef(n), s = e.$modeName$ ? e.$modeName$ : "$";
      t.components.some((e => e.tag === o && e.mode === s)) || t.components.push({
       tag: o,
       mode: s,
       count: 0,
       depth: -1
      });
     } catch (t) {
      e.console.error(t);
     }
     l.delete(n);
    }
   }(e, o, n.nodeName, n, d)) : m;
  }
  function y() {
   const e = Array.from(i).filter((e => e.parentElement));
   return e.length > 0 ? Promise.all(e.map(L)).then(y) : m;
  }
  e.document.createElement = function t(o) {
   const n = c.call(e.document, o);
   return u(n), n;
  }, e.document.createElementNS = function t(o, n) {
   const s = $.call(e.document, o, n);
   return u(s), s;
  }, p = global.setTimeout((function I() {
   a(`Hydrate exceeded timeout${function e(t) {
    return Array.from(t).map(waitingOnElementMsg);
   }(d)}`);
  }), t.timeout), plt.$resourcesUrl$ = new URL(t.resourcesUrl || "./", doc.baseURI).href, 
  g(e.document.body), y().then(l).catch(a);
 } catch (D) {
  a(D);
 }
}

function isValidComponent(e, t) {
 if (null != e && 1 === e.nodeType) {
  const o = e.nodeName;
  if ("string" == typeof o && o.includes("-")) return !t.excludeComponents.includes(o.toLowerCase());
 }
 return !1;
}

function shouldHydrate(e) {
 if (9 === e.nodeType) return !0;
 if (NO_HYDRATE_TAGS.has(e.nodeName)) return !1;
 if (e.hasAttribute("no-prerender")) return !1;
 const t = e.parentNode;
 return null == t || shouldHydrate(t);
}

function renderCatchError(e, t, o) {
 const n = {
  level: "error",
  type: "build",
  header: "Hydrate Error",
  messageText: "",
  relFilePath: void 0,
  absFilePath: void 0,
  lines: []
 };
 if (e.url) try {
  const t = new URL(e.url);
  "/" !== t.pathname && (n.header += ": " + t.pathname);
 } catch (e) {}
 null != o && (null != o.stack ? n.messageText = o.stack.toString() : null != o.message ? n.messageText = o.message.toString() : n.messageText = o.toString()), 
 t.diagnostics.push(n);
}

function printTag(e) {
 let t = `<${e.nodeName.toLowerCase()}`;
 if (Array.isArray(e.attributes)) for (let o = 0; o < e.attributes.length; o++) {
  const n = e.attributes[o];
  t += ` ${n.name}`, "" !== n.value && (t += `="${n.value}"`);
 }
 return t += ">", t;
}

function waitingOnElementMsg(e) {
 let t = "";
 if (e) {
  const o = [];
  t = " - waiting on:";
  let n = e;
  for (;n && 9 !== n.nodeType && "BODY" !== n.nodeName; ) o.unshift(printTag(n)), 
  n = n.parentElement;
  let s = "";
  for (const e of o) s += "  ", t += `\n${s}${e}`;
 }
 return t;
}

const createTime = (e, t = "") => {
 return () => {};
}, SLOT_FB_CSS = "slot-fb{display:contents}slot-fb[hidden]{display:none}", EMPTY_OBJ = {}, isComplexType = e => "object" == (e = typeof e) || "function" === e, isPromise = e => !!e && ("object" == typeof e || "function" == typeof e) && "function" == typeof e.then, h = (e, t, ...o) => {
 let n = null, s = null, l = null, a = !1, r = !1;
 const i = [], d = t => {
  for (let o = 0; o < t.length; o++) n = t[o], Array.isArray(n) ? d(n) : null != n && "boolean" != typeof n && ((a = "function" != typeof e && !isComplexType(n)) ? n = String(n) : BUILD.isDev  , 
  a && r ? i[i.length - 1].$text$ += n : i.push(a ? newVNode(null, n) : n), r = a);
 };
 if (d(o), t && (t.key && (s = t.key), 
 t.name && (l = t.name), BUILD.vdomClass)) {
  const e = t.className || t.class;
  e && (t.class = "object" != typeof e ? e : Object.keys(e).filter((t => e[t])).join(" "));
 }
 if ("function" == typeof e) return e(null === t ? {} : t, i, vdomFnUtils);
 const c = newVNode(e, null);
 return c.$attrs$ = t, i.length > 0 && (c.$children$ = i), (c.$key$ = s), 
 (c.$name$ = l), c;
}, newVNode = (e, t) => {
 const o = {
  $flags$: 0,
  $tag$: e,
  $text$: t,
  $elm$: null,
  $children$: null
 };
 return (o.$attrs$ = null), (o.$key$ = null), 
 (o.$name$ = null), o;
}, Host = {}, isHost = e => e && e.$tag$ === Host, vdomFnUtils = {
 forEach: (e, t) => e.map(convertToPublic).forEach(t),
 map: (e, t) => e.map(convertToPublic).map(t).map(convertToPrivate)
}, convertToPublic = e => ({
 vattrs: e.$attrs$,
 vchildren: e.$children$,
 vkey: e.$key$,
 vname: e.$name$,
 vtag: e.$tag$,
 vtext: e.$text$
}), convertToPrivate = e => {
 if ("function" == typeof e.vtag) {
  const t = {
   ...e.vattrs
  };
  return e.vkey && (t.key = e.vkey), e.vname && (t.name = e.vname), h(e.vtag, t, ...e.vchildren || []);
 }
 const t = newVNode(e.vtag, e.vtext);
 return t.$attrs$ = e.vattrs, t.$children$ = e.vchildren, t.$key$ = e.vkey, t.$name$ = e.vname, 
 t;
}, clientHydrate = (e, t, o, n, s, l, a) => {
 let r, i, d, c;
 if (1 === l.nodeType) {
  for (r = l.getAttribute("c-id"), r && (i = r.split("."), i[0] !== a && "0" !== i[0] || (d = {
   $flags$: 0,
   $hostId$: i[0],
   $nodeId$: i[1],
   $depth$: i[2],
   $index$: i[3],
   $tag$: l.tagName.toLowerCase(),
   $elm$: l,
   $attrs$: null,
   $children$: null,
   $key$: null,
   $name$: null,
   $text$: null
  }, t.push(d), l.removeAttribute("c-id"), e.$children$ || (e.$children$ = []), e.$children$[d.$index$] = d, 
  e = d, n && "0" === d.$depth$ && (n[d.$index$] = d.$elm$))), c = l.childNodes.length - 1; c >= 0; c--) clientHydrate(e, t, o, n, s, l.childNodes[c], a);
  if (l.shadowRoot) for (c = l.shadowRoot.childNodes.length - 1; c >= 0; c--) clientHydrate(e, t, o, n, s, l.shadowRoot.childNodes[c], a);
 } else if (8 === l.nodeType) i = l.nodeValue.split("."), i[1] !== a && "0" !== i[1] || (r = i[0], 
 d = {
  $flags$: 0,
  $hostId$: i[1],
  $nodeId$: i[2],
  $depth$: i[3],
  $index$: i[4],
  $elm$: l,
  $attrs$: null,
  $children$: null,
  $key$: null,
  $name$: null,
  $tag$: null,
  $text$: null
 }, "t" === r ? (d.$elm$ = l.nextSibling, d.$elm$ && 3 === d.$elm$.nodeType && (d.$text$ = d.$elm$.textContent, 
 t.push(d), l.remove(), e.$children$ || (e.$children$ = []), e.$children$[d.$index$] = d, 
 n && "0" === d.$depth$ && (n[d.$index$] = d.$elm$))) : d.$hostId$ === a && ("s" === r ? (d.$tag$ = "slot", 
 i[5] ? l["s-sn"] = d.$name$ = i[5] : l["s-sn"] = "", l["s-sr"] = !0, n && (d.$elm$ = doc.createElement(d.$tag$), 
 d.$name$ && d.$elm$.setAttribute("name", d.$name$), l.parentNode.insertBefore(d.$elm$, l), 
 l.remove(), "0" === d.$depth$ && (n[d.$index$] = d.$elm$)), o.push(d), e.$children$ || (e.$children$ = []), 
 e.$children$[d.$index$] = d) : "r" === r && (n ? l.remove() : (s["s-cr"] = l, 
 l["s-cn"] = !0)))); else if (e && "style" === e.$tag$) {
  const t = newVNode(null, l.textContent);
  t.$elm$ = l, t.$index$ = "0", e.$children$ = [ t ];
 }
}, initializeDocumentHydrate = (e, t) => {
 if (1 === e.nodeType) {
  let o = 0;
  for (;o < e.childNodes.length; o++) initializeDocumentHydrate(e.childNodes[o], t);
  if (e.shadowRoot) for (o = 0; o < e.shadowRoot.childNodes.length; o++) initializeDocumentHydrate(e.shadowRoot.childNodes[o], t);
 } else if (8 === e.nodeType) {
  const o = e.nodeValue.split(".");
  "o" === o[0] && (t.set(o[1] + "." + o[2], e), e.nodeValue = "", e["s-en"] = o[3]);
 }
}, parsePropertyValue = (e, t) => null == e || isComplexType(e) ? e : 4 & t ? "false" !== e && ("" === e || !!e) : 1 & t ? String(e) : e, emitEvent = (e, t, o) => {
 const n = plt.ce(t, o);
 return e.dispatchEvent(n), n;
}, rootAppliedStyles = new WeakMap, registerStyle = (e, t, o) => {
 let n = styles.get(e);
 n = t, styles.set(e, n);
}, addStyle = (e, t, o) => {
 var n;
 const s = getScopeId(t), l = styles.get(s);
 if (e = 11 === e.nodeType ? e : doc, l) if ("string" == typeof l) {
  e = e.head || e;
  let o, a = rootAppliedStyles.get(e);
  if (a || rootAppliedStyles.set(e, a = new Set), !a.has(s)) {
   if (e.host && (o = e.querySelector(`[sty-id="${s}"]`))) o.innerHTML = l; else {
    o = doc.createElement("style"), o.innerHTML = l;
    const t = null !== (n = plt.$nonce$) && void 0 !== n ? n : queryNonceMetaTagContent(doc);
    null != t && o.setAttribute("nonce", t), o.setAttribute("sty-id", s), 
    e.insertBefore(o, e.querySelector("link"));
   }
   4 & t.$flags$ && (o.innerHTML += SLOT_FB_CSS), a && a.add(s);
  }
 }
 return s;
}, attachStyles = e => {
 const t = e.$cmpMeta$, o = e.$hostElement$, n = t.$flags$, s = createTime("attachStyles", t.$tagName$), l = addStyle(o.getRootNode(), t);
 10 & n && (o["s-sc"] = l, 
 o.classList.add(l + "-h"), 2 & n && o.classList.add(l + "-s")), 
 s();
}, getScopeId = (e, t) => "sc-" + (e.$tagName$), setAccessor = (e, t, o, n, s, l) => {
 if (o !== n) {
  let a = isMemberInElement(e, t), r = t.toLowerCase();
  if ("class" === t) {
   const t = e.classList, s = parseClassList(o), l = parseClassList(n);
   t.remove(...s.filter((e => e && !l.includes(e)))), t.add(...l.filter((e => e && !s.includes(e))));
  } else if ("key" === t) ; else if ("ref" === t) n && n(e); else if ((a ) || "o" !== t[0] || "n" !== t[1]) {
   {
    const i = isComplexType(n);
    if ((a || i && null !== n) && !s) try {
     if (e.tagName.includes("-")) e[t] = n; else {
      const s = null == n ? "" : n;
      "list" === t ? a = !1 : null != o && e[t] == s || (e[t] = s);
     }
    } catch (e) {}
    null == n || !1 === n ? !1 === n && "" !== e.getAttribute(t) || (e.removeAttribute(t)) : (!a || 4 & l || s) && !i && (n = !0 === n ? "" : n, 
    e.setAttribute(t, n));
   }
  } else if (t = "-" === t[2] ? t.slice(3) : isMemberInElement(win, r) ? r.slice(2) : r[2] + t.slice(3), 
  o || n) {
   const s = t.endsWith(CAPTURE_EVENT_SUFFIX);
   t = t.replace(CAPTURE_EVENT_REGEX, ""), o && plt.rel(e, t, o, s), n && plt.ael(e, t, n, s);
  }
 }
}, parseClassListRegex = /\s/, parseClassList = e => e ? e.split(parseClassListRegex) : [], CAPTURE_EVENT_SUFFIX = "Capture", CAPTURE_EVENT_REGEX = new RegExp(CAPTURE_EVENT_SUFFIX + "$"), updateElement = (e, t, o, n) => {
 const s = 11 === t.$elm$.nodeType && t.$elm$.host ? t.$elm$.host : t.$elm$, l = e && e.$attrs$ || EMPTY_OBJ, a = t.$attrs$ || EMPTY_OBJ;
 for (n in l) n in a || setAccessor(s, n, l[n], void 0, o, t.$flags$);
 for (n in a) setAccessor(s, n, l[n], a[n], o, t.$flags$);
};

let scopeId, contentRef, hostTagName, useNativeShadowDom = !1, checkSlotFallbackVisibility = !1, checkSlotRelocate = !1, isSvgMode = !1;

const createElm = (e, t, o, n) => {
 const s = t.$children$[o];
 let l, a, r, i = 0;
 if (!useNativeShadowDom && (checkSlotRelocate = !0, "slot" === s.$tag$ && (scopeId && n.classList.add(scopeId + "-s"), 
 s.$flags$ |= s.$children$ ? 2 : 1)), null !== s.$text$) l = s.$elm$ = doc.createTextNode(s.$text$); else if (1 & s.$flags$) l = s.$elm$ = slotReferenceDebugNode(s) ; else {
  if (!isSvgMode && (isSvgMode = "svg" === s.$tag$), l = s.$elm$ = doc.createElementNS(isSvgMode ? "http://www.w3.org/2000/svg" : "http://www.w3.org/1999/xhtml", 2 & s.$flags$ ? "slot-fb" : s.$tag$) , 
  isSvgMode && "foreignObject" === s.$tag$ && (isSvgMode = !1), updateElement(null, s, isSvgMode), 
  null != scopeId && l["s-si"] !== scopeId && l.classList.add(l["s-si"] = scopeId), 
  s.$children$) for (i = 0; i < s.$children$.length; ++i) a = createElm(e, s, i, l), 
  a && l.appendChild(a);
  ("svg" === s.$tag$ ? isSvgMode = !1 : "foreignObject" === l.tagName && (isSvgMode = !0));
 }
 return l["s-hn"] = hostTagName, 3 & s.$flags$ && (l["s-sr"] = !0, 
 l["s-cr"] = contentRef, l["s-sn"] = s.$name$ || "", r = e && e.$children$ && e.$children$[o], 
 r && r.$tag$ === s.$tag$ && e.$elm$ && (putBackInOriginalLocation(e.$elm$, !1))), 
 l;
}, putBackInOriginalLocation = (e, t) => {
 plt.$flags$ |= 1;
 const o = e.childNodes;
 for (let e = o.length - 1; e >= 0; e--) {
  const n = o[e];
  n["s-hn"] !== hostTagName && n["s-ol"] && (parentReferenceNode(n).insertBefore(n, referenceNode(n)), 
  n["s-ol"].remove(), n["s-ol"] = void 0, n["s-sh"] = void 0, checkSlotRelocate = !0), 
  t && putBackInOriginalLocation(n, t);
 }
 plt.$flags$ &= -2;
}, addVnodes = (e, t, o, n, s, l) => {
 let a, r = e["s-cr"] && e["s-cr"].parentNode || e;
 for (r.shadowRoot && r.tagName === hostTagName && (r = r.shadowRoot); s <= l; ++s) n[s] && (a = createElm(null, o, s, e), 
 a && (n[s].$elm$ = a, r.insertBefore(a, referenceNode(t) )));
}, removeVnodes = (e, t, o) => {
 for (let n = t; n <= o; ++n) {
  const t = e[n];
  if (t) {
   const e = t.$elm$;
   nullifyVNodeRefs(t), e && ((checkSlotFallbackVisibility = !0, 
   e["s-ol"] ? e["s-ol"].remove() : putBackInOriginalLocation(e, !0)), e.remove());
  }
 }
}, isSameVnode = (e, t, o = !1) => e.$tag$ === t.$tag$ && ("slot" === e.$tag$ ? e.$name$ === t.$name$ : !(!o) || e.$key$ === t.$key$), referenceNode = e => e && e["s-ol"] || e, parentReferenceNode = e => (e["s-ol"] ? e["s-ol"] : e).parentNode, patch = (e, t, o = !1) => {
 const n = t.$elm$ = e.$elm$, s = e.$children$, l = t.$children$, a = t.$tag$, r = t.$text$;
 let i;
 null !== r ? (i = n["s-cr"]) ? i.parentNode.textContent = r : e.$text$ !== r && (n.data = r) : ((isSvgMode = "svg" === a || "foreignObject" !== a && isSvgMode), 
 ("slot" === a && !useNativeShadowDom ? BUILD.experimentalSlotFixes   : updateElement(e, t, isSvgMode)), null !== s && null !== l ? ((e, t, o, n, s = !1) => {
  let l, a, r = 0, i = 0, d = 0, c = 0, $ = t.length - 1, m = t[0], p = t[$], h = n.length - 1, f = n[0], u = n[h];
  for (;r <= $ && i <= h; ) if (null == m) m = t[++r]; else if (null == p) p = t[--$]; else if (null == f) f = n[++i]; else if (null == u) u = n[--h]; else if (isSameVnode(m, f, s)) patch(m, f, s), 
  m = t[++r], f = n[++i]; else if (isSameVnode(p, u, s)) patch(p, u, s), p = t[--$], 
  u = n[--h]; else if (isSameVnode(m, u, s)) "slot" !== m.$tag$ && "slot" !== u.$tag$ || putBackInOriginalLocation(m.$elm$.parentNode, !1), 
  patch(m, u, s), e.insertBefore(m.$elm$, p.$elm$.nextSibling), m = t[++r], u = n[--h]; else if (isSameVnode(p, f, s)) "slot" !== m.$tag$ && "slot" !== u.$tag$ || putBackInOriginalLocation(p.$elm$.parentNode, !1), 
  patch(p, f, s), e.insertBefore(p.$elm$, m.$elm$), p = t[--$], f = n[++i]; else {
   if (d = -1, BUILD.vdomKey) for (c = r; c <= $; ++c) if (t[c] && null !== t[c].$key$ && t[c].$key$ === f.$key$) {
    d = c;
    break;
   }
   d >= 0 ? (a = t[d], a.$tag$ !== f.$tag$ ? l = createElm(t && t[i], o, d, e) : (patch(a, f, s), 
   t[d] = void 0, l = a.$elm$), f = n[++i]) : (l = createElm(t && t[i], o, i, e), f = n[++i]), 
   l && (parentReferenceNode(m.$elm$).insertBefore(l, referenceNode(m.$elm$)) );
  }
  r > $ ? addVnodes(e, null == n[h + 1] ? null : n[h + 1].$elm$, o, n, i, h) : i > h && removeVnodes(t, r, $);
 })(n, s, t, l, o) : null !== l ? (null !== e.$text$ && (n.textContent = ""), 
 addVnodes(n, null, t, l, 0, l.length - 1)) : null !== s && removeVnodes(s, 0, s.length - 1), 
 isSvgMode && "svg" === a && (isSvgMode = !1));
}, updateFallbackSlotVisibility = e => {
 const t = e.childNodes;
 for (const e of t) if (1 === e.nodeType) {
  if (e["s-sr"]) {
   const o = e["s-sn"];
   e.hidden = !1;
   for (const n of t) if (n !== e) if (n["s-hn"] !== e["s-hn"] || "" !== o) {
    if (1 === n.nodeType && (o === n.getAttribute("slot") || o === n["s-sn"])) {
     e.hidden = !0;
     break;
    }
   } else if (1 === n.nodeType || 3 === n.nodeType && "" !== n.textContent.trim()) {
    e.hidden = !0;
    break;
   }
  }
  updateFallbackSlotVisibility(e);
 }
}, relocateNodes = [], markSlotContentForRelocation = e => {
 let t, o, n;
 for (const s of e.childNodes) {
  if (s["s-sr"] && (t = s["s-cr"]) && t.parentNode) {
   o = t.parentNode.childNodes;
   const e = s["s-sn"];
   for (n = o.length - 1; n >= 0; n--) if (t = o[n], !(t["s-cn"] || t["s-nr"] || t["s-hn"] === s["s-hn"] || BUILD.experimentalSlotFixes  )) if (isNodeLocatedInSlot(t, e)) {
    let o = relocateNodes.find((e => e.$nodeToRelocate$ === t));
    checkSlotFallbackVisibility = !0, t["s-sn"] = t["s-sn"] || e, o ? (o.$nodeToRelocate$["s-sh"] = s["s-hn"], 
    o.$slotRefNode$ = s) : (t["s-sh"] = s["s-hn"], relocateNodes.push({
     $slotRefNode$: s,
     $nodeToRelocate$: t
    })), t["s-sr"] && relocateNodes.map((e => {
     isNodeLocatedInSlot(e.$nodeToRelocate$, t["s-sn"]) && (o = relocateNodes.find((e => e.$nodeToRelocate$ === t)), 
     o && !e.$slotRefNode$ && (e.$slotRefNode$ = o.$slotRefNode$));
    }));
   } else relocateNodes.some((e => e.$nodeToRelocate$ === t)) || relocateNodes.push({
    $nodeToRelocate$: t
   });
  }
  1 === s.nodeType && markSlotContentForRelocation(s);
 }
}, isNodeLocatedInSlot = (e, t) => 1 === e.nodeType ? null === e.getAttribute("slot") && "" === t || e.getAttribute("slot") === t : e["s-sn"] === t || "" === t, nullifyVNodeRefs = e => {
 (e.$attrs$ && e.$attrs$.ref && e.$attrs$.ref(null), e.$children$ && e.$children$.map(nullifyVNodeRefs));
}, renderVdom = (e, t, o = !1) => {
 var n, s, l, a;
 const i = e.$hostElement$, c = e.$vnode$ || newVNode(null, null), $ = isHost(t) ? t : h(null, null, t);
 if (hostTagName = i.tagName, BUILD.isDev  ) ;
 if (o && $.$attrs$) for (const e of Object.keys($.$attrs$)) i.hasAttribute(e) && ![ "key", "ref", "style", "class" ].includes(e) && ($.$attrs$[e] = i[e]);
 if ($.$tag$ = null, $.$flags$ |= 4, e.$vnode$ = $, $.$elm$ = c.$elm$ = i.shadowRoot || i, 
 (scopeId = i["s-sc"]), useNativeShadowDom = supportsShadow, 
 (contentRef = i["s-cr"], checkSlotFallbackVisibility = !1), 
 patch(c, $, o), BUILD.slotRelocation) {
  if (plt.$flags$ |= 1, checkSlotRelocate) {
   markSlotContentForRelocation($.$elm$);
   for (const e of relocateNodes) {
    const t = e.$nodeToRelocate$;
    if (!t["s-ol"]) {
     const e = originalLocationDebugNode(t) ;
     e["s-nr"] = t, t.parentNode.insertBefore(t["s-ol"] = e, t);
    }
   }
   for (const e of relocateNodes) {
    const t = e.$nodeToRelocate$, r = e.$slotRefNode$;
    if (r) {
     const e = r.parentNode;
     let o = r.nextSibling;
     {
      let l = null === (n = t["s-ol"]) || void 0 === n ? void 0 : n.previousSibling;
      for (;l; ) {
       let n = null !== (s = l["s-nr"]) && void 0 !== s ? s : null;
       if (n && n["s-sn"] === t["s-sn"] && e === n.parentNode && (n = n.nextSibling, !n || !n["s-nr"])) {
        o = n;
        break;
       }
       l = l.previousSibling;
      }
     }
     (!o && e !== t.parentNode || t.nextSibling !== o) && t !== o && (t["s-hn"] || !t["s-ol"] || (t["s-hn"] = t["s-ol"].parentNode.nodeName), 
     e.insertBefore(t, o), 1 === t.nodeType && (t.hidden = null !== (l = t["s-ih"]) && void 0 !== l && l));
    } else 1 === t.nodeType && (o && (t["s-ih"] = null !== (a = t.hidden) && void 0 !== a && a), 
    t.hidden = !0);
   }
  }
  checkSlotFallbackVisibility && updateFallbackSlotVisibility($.$elm$), plt.$flags$ &= -2, 
  relocateNodes.length = 0;
 }
 contentRef = void 0;
}, slotReferenceDebugNode = e => doc.createComment(`<slot${e.$name$ ? ' name="' + e.$name$ + '"' : ""}> (host=${hostTagName.toLowerCase()})`), originalLocationDebugNode = e => doc.createComment("org-location for " + (e.localName ? `<${e.localName}> (host=${e["s-hn"]})` : `[${e.textContent}]`)), attachToAncestor = (e, t) => {
 t && !e.$onRenderResolve$ && t["s-p"] && t["s-p"].push(new Promise((t => e.$onRenderResolve$ = t)));
}, scheduleUpdate = (e, t) => {
 if ((e.$flags$ |= 16), 4 & e.$flags$) return void (e.$flags$ |= 512);
 attachToAncestor(e, e.$ancestorComponent$);
 const o = () => dispatchHooks(e, t);
 return writeTask(o) ;
}, dispatchHooks = (e, t) => {
 const o = e.$hostElement$, n = createTime("scheduleUpdate", e.$cmpMeta$.$tagName$), s = e.$lazyInstance$ ;
 let l;
 return t ? (emitLifecycleEvent(o), (l = safeCall(s, "componentWillLoad"))) : (emitLifecycleEvent(o), 
 BUILD.cmpWillUpdate ), emitLifecycleEvent(o), 
 n(), enqueue(l, (() => updateComponent(e, s, t)));
}, enqueue = (e, t) => isPromisey(e) ? e.then(t) : t(), isPromisey = e => e instanceof Promise || e && e.then && "function" == typeof e.then, updateComponent = async (e, t, o) => {
 var n;
 const s = e.$hostElement$, l = createTime("update", e.$cmpMeta$.$tagName$), a = s["s-rc"];
 o && attachStyles(e);
 const r = createTime("render", e.$cmpMeta$.$tagName$);
 if (await callRender(e, t, s, o) , 
 BUILD.hydrateServerSide) try {
  serverSideConnected(s), o && (1 & e.$cmpMeta$.$flags$ ? s["s-en"] = "" : 2 & e.$cmpMeta$.$flags$ && (s["s-en"] = "c"));
 } catch (e) {
  consoleError(e, s);
 }
 if (a && (a.map((e => e())), s["s-rc"] = void 0), r(), l(), 
 BUILD.asyncLoading) {
  const t = null !== (n = s["s-p"]) && void 0 !== n ? n : [], o = () => postUpdateComponent(e);
  0 === t.length ? o() : (Promise.all(t).then(o), e.$flags$ |= 4, t.length = 0);
 }
};

const callRender = (e, t, o, n) => {
 try {
  if (t = t.render(), (e.$flags$ &= -17), 
  (e.$flags$ |= 2), BUILD.hasRenderFn ) {
   return Promise.resolve(t).then((t => renderVdom(e, t, n)));
  }
 } catch (t) {
  consoleError(t, e.$hostElement$);
 }
 return null;
}, postUpdateComponent = e => {
 const t = e.$cmpMeta$.$tagName$, o = e.$hostElement$, n = createTime("postUpdate", t), s = e.$lazyInstance$ , l = e.$ancestorComponent$;
 (safeCall(s, "componentDidRender"), 
 BUILD.isDev ), 64 & e.$flags$ ? (n()) : (e.$flags$ |= 64, addHydratedFlag(o), 
 n(), (e.$onReadyResolve$(o), l || appDidLoad())), (e.$onRenderResolve$ && (e.$onRenderResolve$(), e.$onRenderResolve$ = void 0), 
 512 & e.$flags$ && nextTick((() => scheduleUpdate(e, !1))), e.$flags$ &= -517);
}, appDidLoad = e => {
 addHydratedFlag(doc.documentElement), nextTick((() => emitEvent(win, "appload", {
  detail: {
   namespace: NAMESPACE
  }
 })));
}, safeCall = (e, t, o) => {
 if (e && e[t]) try {
  return e[t](o);
 } catch (e) {
  consoleError(e);
 }
}, emitLifecycleEvent = (e, t) => {
}, addHydratedFlag = e => e.classList.add("hydrated") , serverSideConnected = e => {
 const t = e.children;
 if (null != t) for (let e = 0, o = t.length; e < o; e++) {
  const o = t[e];
  "function" == typeof o.connectedCallback && o.connectedCallback(), serverSideConnected(o);
 }
}, getValue = (e, t) => getHostRef(e).$instanceValues$.get(t), setValue = (e, t, o, n) => {
 const s = getHostRef(e), l = s.$hostElement$ , a = s.$instanceValues$.get(t), r = s.$flags$, i = s.$lazyInstance$ ;
 o = parsePropertyValue(o, n.$members$[t][0]);
 const d = Number.isNaN(a) && Number.isNaN(o), c = o !== a && !d;
 if ((!(8 & r) || void 0 === a) && c && (s.$instanceValues$.set(t, o), 
 i)) {
  if (n.$watchers$ && 128 & r) {
   const e = n.$watchers$[t];
   e && e.map((e => {
    try {
     i[e](o, a, t);
    } catch (e) {
     consoleError(e, l);
    }
   }));
  }
  if (2 == (18 & r)) {
   scheduleUpdate(s, !1);
  }
 }
}, proxyComponent = (e, t, o) => {
 var n;
 const s = e.prototype;
 if (t.$members$) {
  e.watchers && (t.$watchers$ = e.watchers);
  const l = Object.entries(t.$members$);
  if (l.map((([e, [n]]) => {
   (31 & n || (2 & o) && 32 & n) ? Object.defineProperty(s, e, {
    get() {
     return getValue(this, e);
    },
    set(s) {
     setValue(this, e, s, t);
    },
    configurable: !0,
    enumerable: !0
   }) : BUILD.method   ;
  })), (1 & o)) {
   const o = new Map;
   s.attributeChangedCallback = function(e, n, l) {
    plt.jmp((() => {
     var a;
     const r = o.get(e);
     if (this.hasOwnProperty(r)) l = this[r], delete this[r]; else {
      if (s.hasOwnProperty(r) && "number" == typeof this[r] && this[r] == l) return;
      if (null == r) {
       const o = getHostRef(this), s = null == o ? void 0 : o.$flags$;
       if (s && !(8 & s) && 128 & s && l !== n) {
        const r = o.$lazyInstance$ , i = null === (a = t.$watchers$) || void 0 === a ? void 0 : a[e];
        null == i || i.forEach((t => {
         null != r[t] && r[t].call(r, l, n, e);
        }));
       }
       return;
      }
     }
     this[r] = (null !== l || "boolean" != typeof this[r]) && l;
    }));
   }, e.observedAttributes = Array.from(new Set([ ...Object.keys(null !== (n = t.$watchers$) && void 0 !== n ? n : {}), ...l.filter((([e, t]) => 15 & t[0])).map((([e, n]) => {
    const l = n[1] || e;
    return o.set(l, e), l;
   })) ]));
  }
 }
 return e;
}, initializeComponent = async (e, t, o, n) => {
 let s;
 if (0 == (32 & t.$flags$)) {
  if (t.$flags$ |= 32, BUILD.lazyLoad ) {
   if (s = loadModule(o), s.then) {
    s = await s;
   }
   !s.isProxied && ((o.$watchers$ = s.watchers), 
   proxyComponent(s, o, 2), s.isProxied = !0);
   const e = createTime("createInstance", o.$tagName$);
   (t.$flags$ |= 8);
   try {
    new s(t);
   } catch (e) {
    consoleError(e);
   }
   (t.$flags$ &= -9), (t.$flags$ |= 128), e();
  }
  if (s.style) {
   let n = s.style;
   const l = getScopeId(o);
   if (!styles.has(l)) {
    const e = createTime("registerStyles", o.$tagName$);
    registerStyle(l, n), e();
   }
  }
 }
 const r = t.$ancestorComponent$, i = () => scheduleUpdate(t, !0);
 r && r["s-rc"] ? r["s-rc"].push(i) : i();
}, fireConnectedCallback = e => {
}, connectedCallback = e => {
 if (0 == (1 & plt.$flags$)) {
  const t = getHostRef(e), o = t.$cmpMeta$, n = createTime("connectedCallback", o.$tagName$);
  if (1 & t.$flags$) (null == t ? void 0 : t.$lazyInstance$) ? fireConnectedCallback() : (null == t ? void 0 : t.$onReadyPromise$) && t.$onReadyPromise$.then((() => fireConnectedCallback())); else {
   let n;
   if (t.$flags$ |= 1, (n = e.getAttribute("s-id"), n)) {
    ((e, t, o, n) => {
     const s = createTime("hydrateClient", t), l = e.shadowRoot, a = [], r = l ? [] : null, i = n.$vnode$ = newVNode(t, null);
     plt.$orgLocNodes$ || initializeDocumentHydrate(doc.body, plt.$orgLocNodes$ = new Map), 
     e["s-id"] = o, e.removeAttribute("s-id"), clientHydrate(i, a, [], r, e, e, o), a.map((e => {
      const o = e.$hostId$ + "." + e.$nodeId$, n = plt.$orgLocNodes$.get(o), s = e.$elm$;
      n && supportsShadow && "" === n["s-en"] && n.parentNode.insertBefore(s, n.nextSibling), 
      l || (s["s-hn"] = t, n && (s["s-ol"] = n, s["s-ol"]["s-nr"] = s)), plt.$orgLocNodes$.delete(o);
     })), l && r.map((e => {
      e && l.appendChild(e);
     })), s();
    })(e, o.$tagName$, n, t);
   }
   if (!n && (BUILD.hydrateServerSide ) && setContentReference(e), 
   BUILD.asyncLoading) {
    let o = e;
    for (;o = o.parentNode || o.host; ) if (1 === o.nodeType && o.hasAttribute("s-id") && o["s-p"] || o["s-p"]) {
     attachToAncestor(t, t.$ancestorComponent$ = o);
     break;
    }
   }
   initializeComponent(e, t, o);
  }
  n();
 }
}, setContentReference = e => {
 const t = e["s-cr"] = doc.createComment("");
 t["s-cn"] = !0, e.insertBefore(t, e.firstChild);
}, insertVdomAnnotations = (e, t) => {
 if (null != e) {
  const o = {
   hostIds: 0,
   rootLevelIds: 0,
   staticComponents: new Set(t)
  }, n = [];
  parseVNodeAnnotations(e, e.body, o, n), n.forEach((t => {
   var n, s;
   if (null != t && t["s-nr"]) {
    const l = t["s-nr"];
    let a = l["s-host-id"], r = l["s-node-id"], i = `${a}.${r}`;
    if (null == a) if (a = 0, o.rootLevelIds++, r = o.rootLevelIds, i = `${a}.${r}`, 
    1 === l.nodeType) l.setAttribute("c-id", i); else if (3 === l.nodeType) {
     if (0 === a && "" === (null === (n = l.nodeValue) || void 0 === n ? void 0 : n.trim())) return void t.remove();
     const o = e.createComment(i);
     o.nodeValue = `t.${i}`, null === (s = l.parentNode) || void 0 === s || s.insertBefore(o, l);
    }
    let d = `o.${i}`;
    const c = t.parentElement;
    c && ("" === c["s-en"] ? d += "." : "c" === c["s-en"] && (d += ".c")), t.nodeValue = d;
   }
  }));
 }
}, parseVNodeAnnotations = (e, t, o, n) => {
 null != t && (null != t["s-nr"] && n.push(t), 1 === t.nodeType && t.childNodes.forEach((t => {
  const s = getHostRef(t);
  if (null != s && !o.staticComponents.has(t.nodeName.toLowerCase())) {
   const n = {
    nodeIds: 0
   };
   insertVNodeAnnotations(e, t, s.$vnode$, o, n);
  }
  parseVNodeAnnotations(e, t, o, n);
 })));
}, insertVNodeAnnotations = (e, t, o, n, s) => {
 if (null != o) {
  const l = ++n.hostIds;
  if (t.setAttribute("s-id", l), null != t["s-cr"] && (t["s-cr"].nodeValue = `r.${l}`), 
  null != o.$children$) {
   const t = 0;
   o.$children$.forEach(((o, n) => {
    insertChildVNodeAnnotations(e, o, s, l, t, n);
   }));
  }
  if (t && o && o.$elm$ && !t.hasAttribute("c-id")) {
   const e = t.parentElement;
   if (e && e.childNodes) {
    const n = Array.from(e.childNodes), s = n.find((e => 8 === e.nodeType && e["s-sr"]));
    if (s) {
     const e = n.indexOf(t) - 1;
     o.$elm$.setAttribute("c-id", `${s["s-host-id"]}.${s["s-node-id"]}.0.${e}`);
    }
   }
  }
 }
}, insertChildVNodeAnnotations = (e, t, o, n, s, l) => {
 const a = t.$elm$;
 if (null == a) return;
 const r = o.nodeIds++, i = `${n}.${r}.${s}.${l}`;
 if (a["s-host-id"] = n, a["s-node-id"] = r, 1 === a.nodeType) a.setAttribute("c-id", i); else if (3 === a.nodeType) {
  const t = a.parentNode, o = null == t ? void 0 : t.nodeName;
  if ("STYLE" !== o && "SCRIPT" !== o) {
   const o = `t.${i}`, n = e.createComment(o);
   null == t || t.insertBefore(n, a);
  }
 } else if (8 === a.nodeType && a["s-sr"]) {
  const e = `s.${i}.${a["s-sn"] || ""}`;
  a.nodeValue = e;
 }
 if (null != t.$children$) {
  const l = s + 1;
  t.$children$.forEach(((t, s) => {
   insertChildVNodeAnnotations(e, t, o, n, l, s);
  }));
 }
}, hAsync = (e, t, ...o) => {
 if (Array.isArray(o) && o.length > 0) {
  const n = o.flat(1 / 0);
  return n.some(isPromise) ? Promise.all(n).then((o => h(e, t, ...o))).catch((o => h(e, t))) : h(e, t, ...o);
 }
 return h(e, t);
}, NO_HYDRATE_TAGS = new Set([ "CODE", "HEAD", "IFRAME", "INPUT", "OBJECT", "OUTPUT", "NOSCRIPT", "PRE", "SCRIPT", "SELECT", "STYLE", "TEMPLATE", "TEXTAREA" ]);

const cmpModules = new Map, getModule = e => {
 if ("string" == typeof e) {
  e = e.toLowerCase();
  const t = cmpModules.get(e);
  if (null != t) return t[e];
 }
 return null;
}, loadModule = (e, t, o) => getModule(e.$tagName$), isMemberInElement = (e, t) => {
 if (null != e) {
  if (t in e) return !0;
  const o = getModule(e.nodeName);
  if (null != o) {
   const e = o;
   if (null != e && null != e.cmpMeta && null != e.cmpMeta.$members$) return t in e.cmpMeta.$members$;
  }
 }
 return !1;
}, registerComponents = e => {
 for (const t of e) {
  const e = t.cmpMeta.$tagName$;
  cmpModules.set(e, {
   [e]: t
  });
 }
}, win = window, doc = win.document, writeTask = e => {
 process.nextTick((() => {
  try {
   e();
  } catch (e) {
   consoleError(e);
  }
 }));
}, resolved = Promise.resolve(), nextTick = e => resolved.then(e), defaultConsoleError = e => {
 null != e && console.error(e.stack || e.message || e);
}, consoleError = (e, t) => (defaultConsoleError)(e, t), plt = {
 $flags$: 0,
 $resourcesUrl$: "",
 jmp: e => e(),
 raf: e => requestAnimationFrame(e),
 ael: (e, t, o, n) => e.addEventListener(t, o, n),
 rel: (e, t, o, n) => e.removeEventListener(t, o, n),
 ce: (e, t) => new win.CustomEvent(e, t)
}, supportsShadow = !1, hostRefs = new WeakMap, getHostRef = e => hostRefs.get(e), registerInstance = (e, t) => hostRefs.set(t.$lazyInstance$ = e, t), registerHost = (e, t) => {
 const o = {
  $flags$: 0,
  $cmpMeta$: t,
  $hostElement$: e,
  $instanceValues$: new Map,
  $renderCount$: 0
 };
 return o.$onInstancePromise$ = new Promise((e => o.$onInstanceResolve$ = e)), o.$onReadyPromise$ = new Promise((e => o.$onReadyResolve$ = e)), 
 e["s-p"] = [], e["s-rc"] = [], hostRefs.set(e, o);
}, styles = new Map;

const salableButtonCss = "";
var SalableButtonStyle0 = salableButtonCss;

/**
 * button component
 * @slot The button content
 */
class SalableButton {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (hAsync(Host, { key: 'fd2104db6c799269cabfad63e3a5ba7094871764' }, hAsync("button", { key: 'f1f32820c2f2a6d74bf202a885baf716bb9857b2', type: "button", class: "py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800" }, hAsync("slot", { key: '33d3e79f8f91e2b34c40f5bbab942492b3e00ddd' }))));
    }
    static get style() { return SalableButtonStyle0; }
    static get cmpMeta() { return {
        "$flags$": 4,
        "$tagName$": "salable-button",
        "$members$": undefined,
        "$listeners$": undefined,
        "$lazyBundleId$": "-",
        "$attrsToReflect$": []
    }; }
}

var V3_URL = 'https://js.stripe.com/v3';
var V3_URL_REGEX = /^https:\/\/js\.stripe\.com\/v3\/?(\?.*)?$/;
var EXISTING_SCRIPT_MESSAGE = 'loadStripe.setLoadParameters was called but an existing Stripe.js script already exists in the document; existing script parameters will be used';
var findScript = function findScript() {
  var scripts = document.querySelectorAll("script[src^=\"".concat(V3_URL, "\"]"));

  for (var i = 0; i < scripts.length; i++) {
    var script = scripts[i];

    if (!V3_URL_REGEX.test(script.src)) {
      continue;
    }

    return script;
  }

  return null;
};

var injectScript = function injectScript(params) {
  var queryString = params && !params.advancedFraudSignals ? '?advancedFraudSignals=false' : '';
  var script = document.createElement('script');
  script.src = "".concat(V3_URL).concat(queryString);
  var headOrBody = document.head || document.body;

  if (!headOrBody) {
    throw new Error('Expected document.body not to be null. Stripe.js requires a <body> element.');
  }

  headOrBody.appendChild(script);
  return script;
};

var registerWrapper = function registerWrapper(stripe, startTime) {
  if (!stripe || !stripe._registerWrapper) {
    return;
  }

  stripe._registerWrapper({
    name: 'stripe-js',
    version: "2.4.0",
    startTime: startTime
  });
};

var stripePromise = null;
var onErrorListener = null;
var onLoadListener = null;

var onError = function onError(reject) {
  return function () {
    reject(new Error('Failed to load Stripe.js'));
  };
};

var onLoad = function onLoad(resolve, reject) {
  return function () {
    if (window.Stripe) {
      resolve(window.Stripe);
    } else {
      reject(new Error('Stripe.js not available'));
    }
  };
};

var loadScript = function loadScript(params) {
  // Ensure that we only attempt to load Stripe.js at most once
  if (stripePromise !== null) {
    return stripePromise;
  }

  stripePromise = new Promise(function (resolve, reject) {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      // Resolve to null when imported server side. This makes the module
      // safe to import in an isomorphic code base.
      resolve(null);
      return;
    }

    if (window.Stripe && params) {
      console.warn(EXISTING_SCRIPT_MESSAGE);
    }

    if (window.Stripe) {
      resolve(window.Stripe);
      return;
    }

    try {
      var script = findScript();

      if (script && params) {
        console.warn(EXISTING_SCRIPT_MESSAGE);
      } else if (!script) {
        script = injectScript(params);
      } else if (script && onLoadListener !== null && onErrorListener !== null) {
        var _script$parentNode;

        // remove event listeners
        script.removeEventListener('load', onLoadListener);
        script.removeEventListener('error', onErrorListener); // if script exists, but we are reloading due to an error,
        // reload script to trigger 'load' event

        (_script$parentNode = script.parentNode) === null || _script$parentNode === void 0 ? void 0 : _script$parentNode.removeChild(script);
        script = injectScript(params);
      }

      onLoadListener = onLoad(resolve, reject);
      onErrorListener = onError(reject);
      script.addEventListener('load', onLoadListener);
      script.addEventListener('error', onErrorListener);
    } catch (error) {
      reject(error);
      return;
    }
  }); // Resets stripePromise on error

  return stripePromise["catch"](function (error) {
    stripePromise = null;
    return Promise.reject(error);
  });
};
var initStripe = function initStripe(maybeStripe, args, startTime) {
  if (maybeStripe === null) {
    return null;
  }

  var stripe = maybeStripe.apply(undefined, args);
  registerWrapper(stripe, startTime);
  return stripe;
}; // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types

var stripePromise$1;
var loadCalled = false;

var getStripePromise = function getStripePromise() {
  if (stripePromise$1) {
    return stripePromise$1;
  }

  stripePromise$1 = loadScript(null)["catch"](function (error) {
    // clear cache on error
    stripePromise$1 = null;
    return Promise.reject(error);
  });
  return stripePromise$1;
}; // Execute our own script injection after a tick to give users time to do their
// own script injection.


Promise.resolve().then(function () {
  return getStripePromise();
})["catch"](function (error) {
  if (!loadCalled) {
    console.warn(error);
  }
});
var loadStripe = function loadStripe() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  loadCalled = true;
  var startTime = Date.now(); // if previous attempts are unsuccessful, will re-load script

  return getStripePromise().then(function (maybeStripe) {
    return initStripe(maybeStripe, args, startTime);
  });
};

const apiUrl = "https://sxvf9yuedh.execute-api.eu-west-1.amazonaws.com/dev";
const stripePublicKey = "pk_live_xxxxx";
const stripePublicKeyTestmode = "pk_test_51M1oo0Ku6oAVKC6A5cXnsTcvd7uEhvZcHlOp9RipUPxXLputaEA0FaTeqonlRILOSCUJpOdlZkx62Kibx1b21IZ700fb3fIPHp";

const salableCheckoutCss = "*.sc-salable-checkout,.sc-salable-checkout::before,.sc-salable-checkout::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}.sc-salable-checkout::before,.sc-salable-checkout::after{--tw-content:''}html.sc-salable-checkout,.sc-salable-checkout-h{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:\"PT Sans\", sans-serif;font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body.sc-salable-checkout{margin:0;line-height:inherit}hr.sc-salable-checkout{height:0;color:inherit;border-top-width:1px}abbr.sc-salable-checkout:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1.sc-salable-checkout,h2.sc-salable-checkout,h3.sc-salable-checkout,h4.sc-salable-checkout,h5.sc-salable-checkout,h6.sc-salable-checkout{font-size:inherit;font-weight:inherit}a.sc-salable-checkout{color:inherit;text-decoration:inherit}b.sc-salable-checkout,strong.sc-salable-checkout{font-weight:bolder}code.sc-salable-checkout,kbd.sc-salable-checkout,samp.sc-salable-checkout,pre.sc-salable-checkout{font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small.sc-salable-checkout{font-size:80%}sub.sc-salable-checkout,sup.sc-salable-checkout{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub.sc-salable-checkout{bottom:-0.25em}sup.sc-salable-checkout{top:-0.5em}table.sc-salable-checkout{text-indent:0;border-color:inherit;border-collapse:collapse}button.sc-salable-checkout,input.sc-salable-checkout,optgroup.sc-salable-checkout,select.sc-salable-checkout,textarea.sc-salable-checkout{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}button.sc-salable-checkout,select.sc-salable-checkout{text-transform:none}button.sc-salable-checkout,[type='button'].sc-salable-checkout,[type='reset'].sc-salable-checkout,[type='submit'].sc-salable-checkout{-webkit-appearance:button;background-color:transparent;background-image:none}.sc-salable-checkout:-moz-focusring{outline:auto}.sc-salable-checkout:-moz-ui-invalid{box-shadow:none}progress.sc-salable-checkout{vertical-align:baseline}.sc-salable-checkout::-webkit-inner-spin-button,.sc-salable-checkout::-webkit-outer-spin-button{height:auto}[type='search'].sc-salable-checkout{-webkit-appearance:textfield;outline-offset:-2px}.sc-salable-checkout::-webkit-search-decoration{-webkit-appearance:none}.sc-salable-checkout::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary.sc-salable-checkout{display:list-item}blockquote.sc-salable-checkout,dl.sc-salable-checkout,dd.sc-salable-checkout,h1.sc-salable-checkout,h2.sc-salable-checkout,h3.sc-salable-checkout,h4.sc-salable-checkout,h5.sc-salable-checkout,h6.sc-salable-checkout,hr.sc-salable-checkout,figure.sc-salable-checkout,p.sc-salable-checkout,pre.sc-salable-checkout{margin:0}fieldset.sc-salable-checkout{margin:0;padding:0}legend.sc-salable-checkout{padding:0}ol.sc-salable-checkout,ul.sc-salable-checkout,menu.sc-salable-checkout{list-style:none;margin:0;padding:0}dialog.sc-salable-checkout{padding:0}textarea.sc-salable-checkout{resize:vertical}input.sc-salable-checkout::-moz-placeholder,textarea.sc-salable-checkout::-moz-placeholder{opacity:1;color:#9ca3af}input.sc-salable-checkout::placeholder,textarea.sc-salable-checkout::placeholder{opacity:1;color:#9ca3af}button.sc-salable-checkout,[role=\"button\"].sc-salable-checkout{cursor:pointer}.sc-salable-checkout:disabled{cursor:default}img.sc-salable-checkout,svg.sc-salable-checkout,video.sc-salable-checkout,canvas.sc-salable-checkout,audio.sc-salable-checkout,iframe.sc-salable-checkout,embed.sc-salable-checkout,object.sc-salable-checkout{display:block;vertical-align:middle}img.sc-salable-checkout,video.sc-salable-checkout{max-width:100%;height:auto}[hidden].sc-salable-checkout{display:none}[type='text'].sc-salable-checkout,input.sc-salable-checkout:where(:not([type])),[type='email'].sc-salable-checkout,[type='url'].sc-salable-checkout,[type='password'].sc-salable-checkout,[type='number'].sc-salable-checkout,[type='date'].sc-salable-checkout,[type='datetime-local'].sc-salable-checkout,[type='month'].sc-salable-checkout,[type='search'].sc-salable-checkout,[type='tel'].sc-salable-checkout,[type='time'].sc-salable-checkout,[type='week'].sc-salable-checkout,[multiple].sc-salable-checkout,textarea.sc-salable-checkout,select.sc-salable-checkout{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:#fff;border-color:#6b7280;border-width:1px;border-radius:0px;padding-top:0.5rem;padding-right:0.75rem;padding-bottom:0.5rem;padding-left:0.75rem;font-size:1rem;line-height:1.5rem;--tw-shadow:0 0 #0000}[type='text'].sc-salable-checkout:focus,input.sc-salable-checkout:where(:not([type])):focus,[type='email'].sc-salable-checkout:focus,[type='url'].sc-salable-checkout:focus,[type='password'].sc-salable-checkout:focus,[type='number'].sc-salable-checkout:focus,[type='date'].sc-salable-checkout:focus,[type='datetime-local'].sc-salable-checkout:focus,[type='month'].sc-salable-checkout:focus,[type='search'].sc-salable-checkout:focus,[type='tel'].sc-salable-checkout:focus,[type='time'].sc-salable-checkout:focus,[type='week'].sc-salable-checkout:focus,[multiple].sc-salable-checkout:focus,textarea.sc-salable-checkout:focus,select.sc-salable-checkout:focus{outline:2px solid transparent;outline-offset:2px;--tw-ring-inset:var(--tw-empty, );--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:#2563eb;--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);border-color:#2563eb}input.sc-salable-checkout::-moz-placeholder,textarea.sc-salable-checkout::-moz-placeholder{color:#6b7280;opacity:1}input.sc-salable-checkout::placeholder,textarea.sc-salable-checkout::placeholder{color:#6b7280;opacity:1}.sc-salable-checkout::-webkit-datetime-edit-fields-wrapper{padding:0}.sc-salable-checkout::-webkit-date-and-time-value{min-height:1.5em;text-align:inherit}.sc-salable-checkout::-webkit-datetime-edit{display:inline-flex}.sc-salable-checkout::-webkit-datetime-edit,.sc-salable-checkout::-webkit-datetime-edit-year-field,.sc-salable-checkout::-webkit-datetime-edit-month-field,.sc-salable-checkout::-webkit-datetime-edit-day-field,.sc-salable-checkout::-webkit-datetime-edit-hour-field,.sc-salable-checkout::-webkit-datetime-edit-minute-field,.sc-salable-checkout::-webkit-datetime-edit-second-field,.sc-salable-checkout::-webkit-datetime-edit-millisecond-field,.sc-salable-checkout::-webkit-datetime-edit-meridiem-field{padding-top:0;padding-bottom:0}select.sc-salable-checkout{background-image:url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\");background-position:right 0.5rem center;background-repeat:no-repeat;background-size:1.5em 1.5em;padding-right:2.5rem;-webkit-print-color-adjust:exact;print-color-adjust:exact}[multiple].sc-salable-checkout,[size].sc-salable-checkout:where(select:not([size=\"1\"])){background-image:initial;background-position:initial;background-repeat:unset;background-size:initial;padding-right:0.75rem;-webkit-print-color-adjust:unset;print-color-adjust:unset}[type='checkbox'].sc-salable-checkout,[type='radio'].sc-salable-checkout{-webkit-appearance:none;-moz-appearance:none;appearance:none;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;display:inline-block;vertical-align:middle;background-origin:border-box;-webkit-user-select:none;-moz-user-select:none;user-select:none;flex-shrink:0;height:1rem;width:1rem;color:#2563eb;background-color:#fff;border-color:#6b7280;border-width:1px;--tw-shadow:0 0 #0000}[type='checkbox'].sc-salable-checkout{border-radius:0px}[type='radio'].sc-salable-checkout{border-radius:100%}[type='checkbox'].sc-salable-checkout:focus,[type='radio'].sc-salable-checkout:focus{outline:2px solid transparent;outline-offset:2px;--tw-ring-inset:var(--tw-empty, );--tw-ring-offset-width:2px;--tw-ring-offset-color:#fff;--tw-ring-color:#2563eb;--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}[type='checkbox'].sc-salable-checkout:checked,[type='radio'].sc-salable-checkout:checked{border-color:transparent;background-color:currentColor;background-size:100% 100%;background-position:center;background-repeat:no-repeat}[type='checkbox'].sc-salable-checkout:checked{background-image:url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e\")}@media (forced-colors: active){[type='checkbox'].sc-salable-checkout:checked{-webkit-appearance:auto;-moz-appearance:auto;appearance:auto}}[type='radio'].sc-salable-checkout:checked{background-image:url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='3'/%3e%3c/svg%3e\")}@media (forced-colors: active){[type='radio'].sc-salable-checkout:checked{-webkit-appearance:auto;-moz-appearance:auto;appearance:auto}}[type='checkbox'].sc-salable-checkout:checked:hover,[type='checkbox'].sc-salable-checkout:checked:focus,[type='radio'].sc-salable-checkout:checked:hover,[type='radio'].sc-salable-checkout:checked:focus{border-color:transparent;background-color:currentColor}[type='checkbox'].sc-salable-checkout:indeterminate{background-image:url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 16'%3e%3cpath stroke='white' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 8h8'/%3e%3c/svg%3e\");border-color:transparent;background-color:currentColor;background-size:100% 100%;background-position:center;background-repeat:no-repeat}@media (forced-colors: active){[type='checkbox'].sc-salable-checkout:indeterminate{-webkit-appearance:auto;-moz-appearance:auto;appearance:auto}}[type='checkbox'].sc-salable-checkout:indeterminate:hover,[type='checkbox'].sc-salable-checkout:indeterminate:focus{border-color:transparent;background-color:currentColor}[type='file'].sc-salable-checkout{background:unset;border-color:inherit;border-width:0;border-radius:0;padding:0;font-size:unset;line-height:inherit}[type='file'].sc-salable-checkout:focus{outline:1px solid ButtonText;outline:1px auto -webkit-focus-ring-color}*.sc-salable-checkout,.sc-salable-checkout::before,.sc-salable-checkout::after{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}.sc-salable-checkout::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}.sr-only.sc-salable-checkout{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;border-width:0}.invisible.sc-salable-checkout{visibility:hidden}.fixed.sc-salable-checkout{position:fixed}.absolute.sc-salable-checkout{position:absolute}.relative.sc-salable-checkout{position:relative}.bottom-6.sc-salable-checkout{bottom:1.5rem}.left-0.sc-salable-checkout{left:0px}.left-1\\/2.sc-salable-checkout{left:50%}.top-0.sc-salable-checkout{top:0px}.z-10.sc-salable-checkout{z-index:10}.mx-auto.sc-salable-checkout{margin-left:auto;margin-right:auto}.my-4.sc-salable-checkout{margin-top:1rem;margin-bottom:1rem}.mb-12.sc-salable-checkout{margin-bottom:3rem}.mb-2.sc-salable-checkout{margin-bottom:0.5rem}.mb-4.sc-salable-checkout{margin-bottom:1rem}.mb-5.sc-salable-checkout{margin-bottom:1.25rem}.mb-6.sc-salable-checkout{margin-bottom:1.5rem}.me-2.sc-salable-checkout{margin-inline-end:0.5rem}.me-3.sc-salable-checkout{margin-inline-end:0.75rem}.mr-4.sc-salable-checkout{margin-right:1rem}.ms-3.sc-salable-checkout{margin-inline-start:0.75rem}.mt-2.sc-salable-checkout{margin-top:0.5rem}.mt-4.sc-salable-checkout{margin-top:1rem}.mt-7.sc-salable-checkout{margin-top:1.75rem}.mt-auto.sc-salable-checkout{margin-top:auto}.block.sc-salable-checkout{display:block}.inline-block.sc-salable-checkout{display:inline-block}.flex.sc-salable-checkout{display:flex}.inline-flex.sc-salable-checkout{display:inline-flex}.table.sc-salable-checkout{display:table}.grid.sc-salable-checkout{display:grid}.h-6.sc-salable-checkout{height:1.5rem}.h-7.sc-salable-checkout{height:1.75rem}.h-full.sc-salable-checkout{height:100%}.w-6.sc-salable-checkout{width:1.5rem}.w-\\[3\\.25rem\\].sc-salable-checkout{width:3.25rem}.w-full.sc-salable-checkout{width:100%}.w-max.sc-salable-checkout{width:-moz-max-content;width:max-content}.min-w-\\[3\\.5rem\\].sc-salable-checkout{min-width:3.5rem}.max-w-\\[200px\\].sc-salable-checkout{max-width:200px}.grow-0.sc-salable-checkout{flex-grow:0}.-translate-x-1\\/2.sc-salable-checkout{--tw-translate-x:-50%;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.transform.sc-salable-checkout{transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.cursor-pointer.sc-salable-checkout{cursor:pointer}.flex-col.sc-salable-checkout{flex-direction:column}.items-center.sc-salable-checkout{align-items:center}.justify-center.sc-salable-checkout{justify-content:center}.justify-between.sc-salable-checkout{justify-content:space-between}.gap-2.sc-salable-checkout{gap:0.5rem}.gap-6.sc-salable-checkout{gap:1.5rem}.space-x-2.sc-salable-checkout>.sc-salable-checkout:not([hidden])~.sc-salable-checkout:not([hidden]){--tw-space-x-reverse:0;margin-right:calc(0.5rem * var(--tw-space-x-reverse));margin-left:calc(0.5rem * calc(1 - var(--tw-space-x-reverse)))}.space-y-2.sc-salable-checkout>.sc-salable-checkout:not([hidden])~.sc-salable-checkout:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(0.5rem * var(--tw-space-y-reverse))}.space-y-2\\.5.sc-salable-checkout>.sc-salable-checkout:not([hidden])~.sc-salable-checkout:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(0.625rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(0.625rem * var(--tw-space-y-reverse))}.overflow-hidden.sc-salable-checkout{overflow:hidden}.rounded-full.sc-salable-checkout{border-radius:9999px}.rounded-lg.sc-salable-checkout{border-radius:0.5rem}.rounded-md.sc-salable-checkout{border-radius:0.375rem}.rounded-xl.sc-salable-checkout{border-radius:0.75rem}.rounded-b.sc-salable-checkout{border-bottom-right-radius:0.25rem;border-bottom-left-radius:0.25rem}.border.sc-salable-checkout{border-width:1px}.border-2.sc-salable-checkout{border-width:2px}.border-t-0.sc-salable-checkout{border-top-width:0px}.border-t-4.sc-salable-checkout{border-top-width:4px}.border-solid.sc-salable-checkout{border-style:solid}.border-gray-100.sc-salable-checkout{--tw-border-opacity:1;border-color:rgb(243 244 246 / var(--tw-border-opacity))}.border-gray-200.sc-salable-checkout{--tw-border-opacity:1;border-color:rgb(229 231 235 / var(--tw-border-opacity))}.border-gray-300.sc-salable-checkout{--tw-border-opacity:1;border-color:rgb(209 213 219 / var(--tw-border-opacity))}.border-orange-500.sc-salable-checkout{--tw-border-opacity:1;border-color:rgb(249 115 22 / var(--tw-border-opacity))}.border-red-300.sc-salable-checkout{--tw-border-opacity:1;border-color:rgb(252 165 165 / var(--tw-border-opacity))}.border-transparent.sc-salable-checkout{border-color:transparent}.bg-gray-200.sc-salable-checkout{--tw-bg-opacity:1;background-color:rgb(229 231 235 / var(--tw-bg-opacity))}.bg-gray-50.sc-salable-checkout{--tw-bg-opacity:1;background-color:rgb(249 250 251 / var(--tw-bg-opacity))}.bg-gray-900.sc-salable-checkout{--tw-bg-opacity:1;background-color:rgb(17 24 39 / var(--tw-bg-opacity))}.bg-orange-500.sc-salable-checkout{--tw-bg-opacity:1;background-color:rgb(249 115 22 / var(--tw-bg-opacity))}.bg-primary-600.sc-salable-checkout{background-color:var(--primary-600)}.bg-red-50.sc-salable-checkout{--tw-bg-opacity:1;background-color:rgb(254 242 242 / var(--tw-bg-opacity))}.bg-white.sc-salable-checkout{--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity))}.p-2.sc-salable-checkout{padding:0.5rem}.p-2\\.5.sc-salable-checkout{padding:0.625rem}.p-4.sc-salable-checkout{padding:1rem}.p-6.sc-salable-checkout{padding:1.5rem}.p-px.sc-salable-checkout{padding:1px}.px-1.sc-salable-checkout{padding-left:0.25rem;padding-right:0.25rem}.px-2.sc-salable-checkout{padding-left:0.5rem;padding-right:0.5rem}.px-3.sc-salable-checkout{padding-left:0.75rem;padding-right:0.75rem}.px-5.sc-salable-checkout{padding-left:1.25rem;padding-right:1.25rem}.py-0.sc-salable-checkout{padding-top:0px;padding-bottom:0px}.py-1.sc-salable-checkout{padding-top:0.25rem;padding-bottom:0.25rem}.py-2.sc-salable-checkout{padding-top:0.5rem;padding-bottom:0.5rem}.py-2\\.5.sc-salable-checkout{padding-top:0.625rem;padding-bottom:0.625rem}.py-20.sc-salable-checkout{padding-top:5rem;padding-bottom:5rem}.text-left.sc-salable-checkout{text-align:left}.text-center.sc-salable-checkout{text-align:center}.align-middle.sc-salable-checkout{vertical-align:middle}.font-sans.sc-salable-checkout{font-family:\"PT Sans\", sans-serif}.text-2xl.sc-salable-checkout{font-size:1.5rem;line-height:2rem}.text-5xl.sc-salable-checkout{font-size:3rem;line-height:1}.text-\\[9px\\].sc-salable-checkout{font-size:9px}.text-base.sc-salable-checkout{font-size:1rem;line-height:1.5rem}.text-lg.sc-salable-checkout{font-size:1.125rem;line-height:1.75rem}.text-sm.sc-salable-checkout{font-size:0.875rem;line-height:1.25rem}.text-xl.sc-salable-checkout{font-size:1.25rem;line-height:1.75rem}.text-xs.sc-salable-checkout{font-size:0.75rem;line-height:1rem}.font-bold.sc-salable-checkout{font-weight:700}.font-medium.sc-salable-checkout{font-weight:500}.font-semibold.sc-salable-checkout{font-weight:600}.uppercase.sc-salable-checkout{text-transform:uppercase}.text-black.sc-salable-checkout{--tw-text-opacity:1;color:rgb(0 0 0 / var(--tw-text-opacity))}.text-gray-500.sc-salable-checkout{--tw-text-opacity:1;color:rgb(107 114 128 / var(--tw-text-opacity))}.text-gray-700.sc-salable-checkout{--tw-text-opacity:1;color:rgb(55 65 81 / var(--tw-text-opacity))}.text-gray-800.sc-salable-checkout{--tw-text-opacity:1;color:rgb(31 41 55 / var(--tw-text-opacity))}.text-gray-900.sc-salable-checkout{--tw-text-opacity:1;color:rgb(17 24 39 / var(--tw-text-opacity))}.text-primary-600.sc-salable-checkout{color:var(--primary-600)}.text-red-600.sc-salable-checkout{--tw-text-opacity:1;color:rgb(220 38 38 / var(--tw-text-opacity))}.text-red-800.sc-salable-checkout{--tw-text-opacity:1;color:rgb(153 27 27 / var(--tw-text-opacity))}.text-transparent.sc-salable-checkout{color:transparent}.text-white.sc-salable-checkout{--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity))}.opacity-0.sc-salable-checkout{opacity:0}.shadow.sc-salable-checkout{--tw-shadow:0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.shadow-sm.sc-salable-checkout{--tw-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05);--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.shadow-xl.sc-salable-checkout{--tw-shadow:0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);--tw-shadow-colored:0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.transition-all.sc-salable-checkout{transition-property:all;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms}.transition-colors.sc-salable-checkout{transition-property:color, background-color, border-color, text-decoration-color, fill, stroke;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms}.duration-200.sc-salable-checkout{transition-duration:200ms}.ease-in-out.sc-salable-checkout{transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1)}.sc-salable-checkout-h{display:block;text-align:left;--primary-50:#BCCAFD;--primary-100:#A8BBFC;--primary-200:#819BFB;--primary-300:#597CF9;--primary-400:#325DF8;--primary-500:#0B3EF7;--primary-600:#0733D1;--primary-700:#0629AA;--primary-800:#042082;--primary-900:#03165B;--primary-950:#021147}.before\\:inline-block.sc-salable-checkout::before{content:var(--tw-content);display:inline-block}.before\\:h-6.sc-salable-checkout::before{content:var(--tw-content);height:1.5rem}.before\\:w-6.sc-salable-checkout::before{content:var(--tw-content);width:1.5rem}.before\\:translate-x-0.sc-salable-checkout::before{content:var(--tw-content);--tw-translate-x:0px;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.before\\:transform.sc-salable-checkout::before{content:var(--tw-content);transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.before\\:rounded-full.sc-salable-checkout::before{content:var(--tw-content);border-radius:9999px}.before\\:bg-white.sc-salable-checkout::before{content:var(--tw-content);--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity))}.before\\:shadow.sc-salable-checkout::before{content:var(--tw-content);--tw-shadow:0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.before\\:ring-0.sc-salable-checkout::before{content:var(--tw-content);--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)}.before\\:transition.sc-salable-checkout::before{content:var(--tw-content);transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms}.before\\:duration-200.sc-salable-checkout::before{content:var(--tw-content);transition-duration:200ms}.before\\:ease-in-out.sc-salable-checkout::before{content:var(--tw-content);transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1)}.checked\\:border-primary-600.sc-salable-checkout:checked{border-color:var(--primary-600)}.checked\\:bg-none.sc-salable-checkout:checked{background-image:none}.checked\\:text-primary-600.sc-salable-checkout:checked{color:var(--primary-600)}.checked\\:before\\:translate-x-full.sc-salable-checkout:checked::before{content:var(--tw-content);--tw-translate-x:100%;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.checked\\:before\\:bg-white.sc-salable-checkout:checked::before{content:var(--tw-content);--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity))}.hover\\:bg-gray-50.sc-salable-checkout:hover{--tw-bg-opacity:1;background-color:rgb(249 250 251 / var(--tw-bg-opacity))}.hover\\:bg-primary-700.sc-salable-checkout:hover{background-color:var(--primary-700)}.hover\\:bg-primary-800.sc-salable-checkout:hover{background-color:var(--primary-800)}.focus\\:border-primary-500.sc-salable-checkout:focus{border-color:var(--primary-500)}.focus\\:outline-none.sc-salable-checkout:focus{outline:2px solid transparent;outline-offset:2px}.focus\\:ring-2.sc-salable-checkout:focus{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)}.focus\\:ring-4.sc-salable-checkout:focus{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)}.focus\\:ring-blue-600.sc-salable-checkout:focus{--tw-ring-opacity:1;--tw-ring-color:rgb(37 99 235 / var(--tw-ring-opacity))}.focus\\:ring-primary-200.sc-salable-checkout:focus{--tw-ring-color:var(--primary-200)}.focus\\:ring-primary-300.sc-salable-checkout:focus{--tw-ring-color:var(--primary-300)}.focus\\:ring-primary-500.sc-salable-checkout:focus{--tw-ring-color:var(--primary-500)}.focus\\:ring-primary-600.sc-salable-checkout:focus{--tw-ring-color:var(--primary-600)}.focus\\:ring-offset-2.sc-salable-checkout:focus{--tw-ring-offset-width:2px}.focus\\:ring-offset-white.sc-salable-checkout:focus{--tw-ring-offset-color:#fff}.focus\\:checked\\:border-primary-600.sc-salable-checkout:checked:focus{border-color:var(--primary-600)}.disabled\\:pointer-events-none.sc-salable-checkout:disabled{pointer-events:none}.disabled\\:opacity-50.sc-salable-checkout:disabled{opacity:0.5}.group.sc-salable-checkout:hover .group-hover\\:visible.sc-salable-checkout{visibility:visible}.group.sc-salable-checkout:hover .group-hover\\:opacity-100.sc-salable-checkout{opacity:1}.group.sc-salable-checkout:focus .group-focus\\:visible.sc-salable-checkout{visibility:visible}.group.sc-salable-checkout:focus .group-focus\\:opacity-100.sc-salable-checkout{opacity:1}@media (min-width: 640px){.sm\\:grid-cols-1.sc-salable-checkout{grid-template-columns:repeat(1, minmax(0, 1fr))}.sm\\:grid-cols-2.sc-salable-checkout{grid-template-columns:repeat(2, minmax(0, 1fr))}}@media (min-width: 1024px){.lg\\:grid-cols-1.sc-salable-checkout{grid-template-columns:repeat(1, minmax(0, 1fr))}.lg\\:grid-cols-2.sc-salable-checkout{grid-template-columns:repeat(2, minmax(0, 1fr))}.lg\\:grid-cols-3.sc-salable-checkout{grid-template-columns:repeat(3, minmax(0, 1fr))}.lg\\:grid-cols-4.sc-salable-checkout{grid-template-columns:repeat(4, minmax(0, 1fr))}.lg\\:items-center.sc-salable-checkout{align-items:center}}@media (min-width: 1280px){.xl\\:p-8.sc-salable-checkout{padding:2rem}}@media (prefers-color-scheme: dark){.dark\\:border-gray-600.sc-salable-checkout{--tw-border-opacity:1;border-color:rgb(75 85 99 / var(--tw-border-opacity))}.dark\\:border-gray-700.sc-salable-checkout{--tw-border-opacity:1;border-color:rgb(55 65 81 / var(--tw-border-opacity))}.dark\\:border-red-800.sc-salable-checkout{--tw-border-opacity:1;border-color:rgb(153 27 27 / var(--tw-border-opacity))}.dark\\:bg-gray-700.sc-salable-checkout{--tw-bg-opacity:1;background-color:rgb(55 65 81 / var(--tw-bg-opacity))}.dark\\:bg-gray-800.sc-salable-checkout{--tw-bg-opacity:1;background-color:rgb(31 41 55 / var(--tw-bg-opacity))}.dark\\:bg-primary-600.sc-salable-checkout{background-color:var(--primary-600)}.dark\\:bg-slate-900.sc-salable-checkout{--tw-bg-opacity:1;background-color:rgb(15 23 42 / var(--tw-bg-opacity))}.dark\\:text-gray-200.sc-salable-checkout{--tw-text-opacity:1;color:rgb(229 231 235 / var(--tw-text-opacity))}.dark\\:text-gray-400.sc-salable-checkout{--tw-text-opacity:1;color:rgb(156 163 175 / var(--tw-text-opacity))}.dark\\:text-red-400.sc-salable-checkout{--tw-text-opacity:1;color:rgb(248 113 113 / var(--tw-text-opacity))}.dark\\:text-white.sc-salable-checkout{--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity))}.dark\\:placeholder-gray-400.sc-salable-checkout::-moz-placeholder{--tw-placeholder-opacity:1;color:rgb(156 163 175 / var(--tw-placeholder-opacity))}.dark\\:placeholder-gray-400.sc-salable-checkout::placeholder{--tw-placeholder-opacity:1;color:rgb(156 163 175 / var(--tw-placeholder-opacity))}.dark\\:before\\:bg-gray-400.sc-salable-checkout::before{content:var(--tw-content);--tw-bg-opacity:1;background-color:rgb(156 163 175 / var(--tw-bg-opacity))}.dark\\:checked\\:border-primary-500.sc-salable-checkout:checked{border-color:var(--primary-500)}.dark\\:checked\\:bg-primary-500.sc-salable-checkout:checked{background-color:var(--primary-500)}.dark\\:checked\\:before\\:bg-white.sc-salable-checkout:checked::before{content:var(--tw-content);--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity))}.dark\\:hover\\:bg-primary-700.sc-salable-checkout:hover{background-color:var(--primary-700)}.dark\\:hover\\:bg-slate-800.sc-salable-checkout:hover{--tw-bg-opacity:1;background-color:rgb(30 41 59 / var(--tw-bg-opacity))}.dark\\:hover\\:text-white.sc-salable-checkout:hover{--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity))}.dark\\:focus\\:border-primary-500.sc-salable-checkout:focus{border-color:var(--primary-500)}.dark\\:focus\\:ring-primary-500.sc-salable-checkout:focus{--tw-ring-color:var(--primary-500)}.dark\\:focus\\:ring-primary-800.sc-salable-checkout:focus{--tw-ring-color:var(--primary-800)}.dark\\:focus\\:ring-primary-900.sc-salable-checkout:focus{--tw-ring-color:var(--primary-900)}.dark\\:focus\\:ring-offset-gray-600.sc-salable-checkout:focus{--tw-ring-offset-color:#4b5563}.dark\\:focus\\:ring-offset-gray-800.sc-salable-checkout:focus{--tw-ring-offset-color:#1f2937}}";
var SalableCheckoutStyle0 = salableCheckoutCss;

class SalableCheckout {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.validateEmail = (email) => {
            if (!Boolean(email))
                return false;
            const validateEmailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
            return validateEmailRegex.test(email);
        };
        this.handleEmailChange = (event) => {
            const input = event.target;
            const email = input.value;
            this.formState = {
                ...this.formState,
                userEmail: email,
                userEmailError: !this.validateEmail(email) ? 'A valid email is required' : null,
            };
        };
        this.handleCreateSubscription = async (event) => {
            event.preventDefault();
            await this.createSubscription();
        };
        this.createSubscription = async () => {
            if (Boolean(this.formState.userEmailError))
                return;
            this.formState = {
                ...this.formState,
                isSubmitting: true,
            };
            try {
                const response = await fetch(`${apiUrl}/checkout/create-subscription`, {
                    method: 'POST',
                    headers: {
                        'x-api-key': `${this.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        planUuid: this.planUuid,
                        email: this.formState.userEmail,
                        member: this.member,
                        granteeId: this.granteeId
                    })
                });
                if (!response.ok) {
                    // Todo: handle errors, display failure message, refresh options
                    this.state = {
                        ...this.state,
                        componentError: 'Failed to create subscription intent'
                    };
                    console.error('Failed to fetch data:', response.statusText);
                    return;
                }
                const data = await response.json();
                this.clientSecret = data.clientSecret;
                this.formState = {
                    ...this.formState,
                    isSubmitting: false,
                };
            }
            catch (error) {
                this.clientSecret = null;
                this.formState = {
                    ...this.formState,
                    formError: "Error creating subscription",
                    isSubmitting: false,
                };
            }
        };
        this.handlePayment = async (event) => {
            event.preventDefault();
            if (!Boolean(this.stripe) || !Boolean(this.elements)) {
                // Then Stripe.js has not yet loaded.
                // Todo: Make sure to disable form submission until Stripe.js has loaded.
                this.formState = {
                    ...this.formState,
                    formError: "Payment element unavailable. Please try again"
                };
                return;
            }
            this.formState = {
                ...this.formState,
                isSubmitting: true,
            };
            const { error } = await this.stripe.confirmPayment({
                elements: this.elements,
                confirmParams: {
                    payment_method_data: {
                        billing_details: {
                            email: this.formState.userEmail
                        }
                    },
                    return_url: this.successUrl,
                    receipt_email: this.formState.userEmail,
                },
            });
            /**
             * This point will only be reached if there is an immediate error when
             * confirming the payment. Otherwise, your customer will be redirected to
             * your `return_url`. For some payment methods like iDEAL, your customer will
             * be redirected to an intermediate site first to authorize the payment, then
             * redirected to the `return_url`.
             */
            if (Boolean(error)) {
                let formError;
                if (error.type === 'card_error' || error.type === 'validation_error') {
                    formError = error.message ?? 'A card or validation error has occurred. Please try again or with a different card';
                }
                else {
                    formError = 'An unexpected error occurred. Please try again';
                }
                this.formState = {
                    ...this.formState,
                    formError,
                    isSubmitting: false,
                };
            }
        };
        this.clientSecret = null;
        this.state = {
            componentError: '',
            plan: null,
        };
        this.formState = {
            userEmail: '',
            formError: null,
            userEmailError: null,
            isSubmitting: false,
        };
        this.stripeTheme = 'stripe';
        this.apiKey = undefined;
        this.planUuid = undefined;
        this.granteeId = undefined;
        this.member = undefined;
        this.successUrl = undefined;
        this.email = undefined;
    }
    async componentWillLoad() {
        this.validateProps();
        window
            .matchMedia("(prefers-color-scheme: dark)")
            .addEventListener("change", (event) => {
            const stripeTheme = event.matches ? "night" : "stripe";
            this._createPaymentElement(stripeTheme);
        });
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            // Dark mode
            this.stripeTheme = 'night';
        }
        else {
            // Light mode
            this.stripeTheme = 'stripe';
        }
        await this.fetchPlan();
        await this.handleEmailPrefill();
    }
    /**
     * Only initialize the stripe element when the client secret
     * is available. Mounting the element in the DOM will be done
     * by the `ComponentDidUpdate` lifecycle
     */
    async componentDidRender() {
        if (!Boolean(this.clientSecret))
            return;
        const paymentIntegration = this.state.plan?.product.organisationPaymentIntegration;
        if (Boolean(this.apiKey)) {
            const publicKey = this.apiKey.startsWith('test_') ? stripePublicKeyTestmode : stripePublicKey;
            this.stripe = await loadStripe(publicKey, {
                stripeAccount: paymentIntegration.accountId,
            });
            this._createPaymentElement(this.stripeTheme);
        }
    }
    render() {
        const isTestMode = this.apiKey.startsWith('test_');
        if (Boolean(this.state.componentError)) {
            return (hAsync("div", { class: "relative rounded-xl overflow-hidden bg-white border border-t-0 border-gray-200 shadow-sm dark:bg-slate-900 dark:border-gray-700" }, hAsync(TestModeBanner, { isTestMode: isTestMode }), hAsync("div", { class: "font-sans p-4 relative" }, hAsync(ErrorMessage, { message: this.state.componentError }))));
        }
        if (Boolean(this.clientSecret)) {
            return (hAsync("div", { class: "relative rounded-xl overflow-hidden bg-white border border-t-0 border-gray-200 shadow-sm dark:bg-slate-900 dark:border-gray-700" }, hAsync(TestModeBanner, { isTestMode: isTestMode }), hAsync("div", { class: "font-sans p-4 relative" }, hAsync(PriceTag, { plan: this.state.plan }), hAsync("form", { onSubmit: this.handlePayment }, hAsync("div", { id: "slb_payment_element", class: "mb-6 py-20" }), hAsync("button", { type: "submit", class: "w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800" }, "Pay")), hAsync(ErrorMessage, { message: this.formState.formError }))));
        }
        return (hAsync("div", { class: "relative rounded-xl overflow-hidden bg-white border border-t-0 border-gray-200 shadow-sm dark:bg-slate-900 dark:border-gray-700" }, hAsync(TestModeBanner, { isTestMode: isTestMode }), hAsync("div", { class: "font-sans p-4 relative" }, hAsync(PriceTag, { plan: this.state.plan }), hAsync("form", { onSubmit: this.handleCreateSubscription }, hAsync("div", { class: "mb-6" }, hAsync("label", { htmlFor: "email", class: "block mb-2 text-sm font-medium text-gray-900 dark:text-white" }, "Email"), hAsync("input", { id: "email", class: "bg-gray-50 dark:bg-gray-700 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:placeholder-gray-400 dark:text-white focus:ring-primary-500 dark:focus:ring-primary-500 focus:border-primary-500 border-gray-300 dark:focus:border-primary-500 dark:border-gray-600", value: this.formState.userEmail, onInput: this.handleEmailChange }), hAsync("p", { class: "text-sm text-red-600 mt-2" }, this.formState.userEmailError)), hAsync("button", { type: "submit", class: "w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800" }, "Continue")), hAsync(ErrorMessage, { message: this.formState.formError }))));
    }
    validateProp(newValue, propName) {
        if (typeof newValue !== 'string' || newValue.trim() === '') {
            throw new Error(`${propName} is a required property and cannot be empty`);
        }
    }
    _createPaymentElement(stripeTheme) {
        if (!Boolean(this.clientSecret))
            return;
        const options = {
            clientSecret: this.clientSecret,
            appearance: {
                theme: stripeTheme,
                variables: {
                    borderRadius: '4px',
                    colorPrimary: 'rgb(37, 99, 235)',
                },
            },
        };
        this.elements = this.stripe.elements(options);
        this.paymentElement = this.elements.create('payment', {
            layout: 'tabs',
        });
        this.paymentElement.mount('#slb_payment_element');
    }
    async handleEmailPrefill() {
        if (!Boolean(this.email))
            return;
        const validEmail = this.validateEmail(this.email);
        this.formState = {
            ...this.formState,
            userEmail: this.email,
            userEmailError: !validEmail ? 'A valid email is required' : null,
        };
        if (!validEmail)
            return;
        await this.createSubscription();
    }
    validateProps() {
        this.validateProp(this.apiKey, 'apiKey');
        this.validateProp(this.planUuid, 'planUuid');
        this.validateProp(this.successUrl, 'successUrl');
        this.validateProp(this.granteeId, 'granteeId');
        this.validateProp(this.member, 'member');
    }
    async fetchPlan() {
        try {
            const response = await fetch(`${apiUrl}/plans/${this.planUuid}?expand=product.organisationPaymentIntegration,currencies.currency`, { method: 'GET', headers: { 'x-api-key': `${this.apiKey}` } });
            if (!response.ok) {
                // Todo: handle errors, display failure message, refresh options
                this.state = {
                    ...this.state,
                    componentError: 'Failed to fetch plan'
                };
                console.error('Failed to fetch data:', response.statusText);
                return;
            }
            const data = await response.json();
            this.state = {
                ...this.state,
                plan: data
            };
        }
        catch (error) {
            this.state = {
                ...this.state,
                componentError: 'Failed to initialise plan data'
            };
            console.error('Error fetching data:', error);
        }
    }
    static get watchers() { return {
        "apiKey": ["validateProp"],
        "planUuid": ["validateProp"],
        "successUrl": ["validateProp"],
        "granteeId": ["validateProp"],
        "member": ["validateProp"]
    }; }
    static get style() { return SalableCheckoutStyle0; }
    static get cmpMeta() { return {
        "$flags$": 2,
        "$tagName$": "salable-checkout",
        "$members$": {
            "apiKey": [1, "api-key"],
            "planUuid": [1, "plan-uuid"],
            "granteeId": [1, "grantee-id"],
            "member": [1],
            "successUrl": [1, "success-url"],
            "email": [1],
            "clientSecret": [32],
            "state": [32],
            "formState": [32],
            "stripeTheme": [32]
        },
        "$listeners$": undefined,
        "$lazyBundleId$": "-",
        "$attrsToReflect$": []
    }; }
}
const PriceTag = ({ plan }) => {
    const planCurrency = plan.currencies[0];
    return (hAsync("div", { class: "flex justify-between mb-6" }, hAsync("p", { class: "text-2xl text-black dark:text-white" }, "Price"), hAsync("p", { class: "text-base text-black dark:text-white" }, plan.pricingType === 'paid' && Boolean(planCurrency)
        ? `${new Intl.NumberFormat(planCurrency.currency.shortName, {
            style: 'currency',
            currency: planCurrency.currency.shortName,
        }).format(planCurrency.price / 100)} / ${plan?.interval}`
        : 'Free')));
};
const ErrorMessage = ({ message }) => {
    if (!Boolean(message))
        return null;
    return (hAsync("div", { id: "alert-additional-content-2", class: "p-4 my-4 text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800", role: "alert" }, hAsync("div", { class: "flex items-center" }, hAsync("span", { class: "sr-only" }, "Info"), hAsync("h3", { class: "text-base font-medium" }, " ", message))));
};
const TestModeBanner = ({ isTestMode }) => {
    return isTestMode ? (hAsync("div", { class: "absolute border-t-4 border-solid left-0 top-0 border-orange-500 w-full text-center" }, hAsync("p", { class: "top-0 absolute px-1 bg-orange-500 rounded-b font-bold text-white uppercase text-xs left-1/2 transform -translate-x-1/2" }, "test mode"))) : null;
};

const salablePricingTableCss = "/*!@*,\n::before,\n::after*/*.sc-salable-pricing-table,.sc-salable-pricing-table::before,.sc-salable-pricing-table::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}/*!@::before,\n::after*/.sc-salable-pricing-table::before,.sc-salable-pricing-table::after{--tw-content:''}/*!@html,\n:host*/html.sc-salable-pricing-table,.sc-salable-pricing-table-h{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:\"PT Sans\", sans-serif;font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}/*!@body*/body.sc-salable-pricing-table{margin:0;line-height:inherit}/*!@hr*/hr.sc-salable-pricing-table{height:0;color:inherit;border-top-width:1px}/*!@abbr:where([title])*/abbr.sc-salable-pricing-table:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}/*!@h1,\nh2,\nh3,\nh4,\nh5,\nh6*/h1.sc-salable-pricing-table,h2.sc-salable-pricing-table,h3.sc-salable-pricing-table,h4.sc-salable-pricing-table,h5.sc-salable-pricing-table,h6.sc-salable-pricing-table{font-size:inherit;font-weight:inherit}/*!@a*/a.sc-salable-pricing-table{color:inherit;text-decoration:inherit}/*!@b,\nstrong*/b.sc-salable-pricing-table,strong.sc-salable-pricing-table{font-weight:bolder}/*!@code,\nkbd,\nsamp,\npre*/code.sc-salable-pricing-table,kbd.sc-salable-pricing-table,samp.sc-salable-pricing-table,pre.sc-salable-pricing-table{font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}/*!@small*/small.sc-salable-pricing-table{font-size:80%}/*!@sub,\nsup*/sub.sc-salable-pricing-table,sup.sc-salable-pricing-table{font-size:75%;line-height:0;position:relative;vertical-align:baseline}/*!@sub*/sub.sc-salable-pricing-table{bottom:-0.25em}/*!@sup*/sup.sc-salable-pricing-table{top:-0.5em}/*!@table*/table.sc-salable-pricing-table{text-indent:0;border-color:inherit;border-collapse:collapse}/*!@button,\ninput,\noptgroup,\nselect,\ntextarea*/button.sc-salable-pricing-table,input.sc-salable-pricing-table,optgroup.sc-salable-pricing-table,select.sc-salable-pricing-table,textarea.sc-salable-pricing-table{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}/*!@button,\nselect*/button.sc-salable-pricing-table,select.sc-salable-pricing-table{text-transform:none}/*!@button,\n[type='button'],\n[type='reset'],\n[type='submit']*/button.sc-salable-pricing-table,[type='button'].sc-salable-pricing-table,[type='reset'].sc-salable-pricing-table,[type='submit'].sc-salable-pricing-table{-webkit-appearance:button;background-color:transparent;background-image:none}/*!@:-moz-focusring*/.sc-salable-pricing-table:-moz-focusring{outline:auto}/*!@:-moz-ui-invalid*/.sc-salable-pricing-table:-moz-ui-invalid{box-shadow:none}/*!@progress*/progress.sc-salable-pricing-table{vertical-align:baseline}/*!@::-webkit-inner-spin-button,\n::-webkit-outer-spin-button*/.sc-salable-pricing-table::-webkit-inner-spin-button,.sc-salable-pricing-table::-webkit-outer-spin-button{height:auto}/*!@[type='search']*/[type='search'].sc-salable-pricing-table{-webkit-appearance:textfield;outline-offset:-2px}/*!@::-webkit-search-decoration*/.sc-salable-pricing-table::-webkit-search-decoration{-webkit-appearance:none}/*!@::-webkit-file-upload-button*/.sc-salable-pricing-table::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}/*!@summary*/summary.sc-salable-pricing-table{display:list-item}/*!@blockquote,\ndl,\ndd,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\nfigure,\np,\npre*/blockquote.sc-salable-pricing-table,dl.sc-salable-pricing-table,dd.sc-salable-pricing-table,h1.sc-salable-pricing-table,h2.sc-salable-pricing-table,h3.sc-salable-pricing-table,h4.sc-salable-pricing-table,h5.sc-salable-pricing-table,h6.sc-salable-pricing-table,hr.sc-salable-pricing-table,figure.sc-salable-pricing-table,p.sc-salable-pricing-table,pre.sc-salable-pricing-table{margin:0}/*!@fieldset*/fieldset.sc-salable-pricing-table{margin:0;padding:0}/*!@legend*/legend.sc-salable-pricing-table{padding:0}/*!@ol,\nul,\nmenu*/ol.sc-salable-pricing-table,ul.sc-salable-pricing-table,menu.sc-salable-pricing-table{list-style:none;margin:0;padding:0}/*!@dialog*/dialog.sc-salable-pricing-table{padding:0}/*!@textarea*/textarea.sc-salable-pricing-table{resize:vertical}/*!@input::-moz-placeholder, textarea::-moz-placeholder*/input.sc-salable-pricing-table::-moz-placeholder,textarea.sc-salable-pricing-table::-moz-placeholder{opacity:1;color:#9ca3af}/*!@input::placeholder,\ntextarea::placeholder*/input.sc-salable-pricing-table::placeholder,textarea.sc-salable-pricing-table::placeholder{opacity:1;color:#9ca3af}/*!@button,\n[role=\"button\"]*/button.sc-salable-pricing-table,[role=\"button\"].sc-salable-pricing-table{cursor:pointer}/*!@:disabled*/.sc-salable-pricing-table:disabled{cursor:default}/*!@img,\nsvg,\nvideo,\ncanvas,\naudio,\niframe,\nembed,\nobject*/img.sc-salable-pricing-table,svg.sc-salable-pricing-table,video.sc-salable-pricing-table,canvas.sc-salable-pricing-table,audio.sc-salable-pricing-table,iframe.sc-salable-pricing-table,embed.sc-salable-pricing-table,object.sc-salable-pricing-table{display:block;vertical-align:middle}/*!@img,\nvideo*/img.sc-salable-pricing-table,video.sc-salable-pricing-table{max-width:100%;height:auto}/*!@[hidden]*/[hidden].sc-salable-pricing-table{display:none}/*!@[type='text'],input:where(:not([type])),[type='email'],[type='url'],[type='password'],[type='number'],[type='date'],[type='datetime-local'],[type='month'],[type='search'],[type='tel'],[type='time'],[type='week'],[multiple],textarea,select*/[type='text'].sc-salable-pricing-table,input.sc-salable-pricing-table:where(:not([type])),[type='email'].sc-salable-pricing-table,[type='url'].sc-salable-pricing-table,[type='password'].sc-salable-pricing-table,[type='number'].sc-salable-pricing-table,[type='date'].sc-salable-pricing-table,[type='datetime-local'].sc-salable-pricing-table,[type='month'].sc-salable-pricing-table,[type='search'].sc-salable-pricing-table,[type='tel'].sc-salable-pricing-table,[type='time'].sc-salable-pricing-table,[type='week'].sc-salable-pricing-table,[multiple].sc-salable-pricing-table,textarea.sc-salable-pricing-table,select.sc-salable-pricing-table{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:#fff;border-color:#6b7280;border-width:1px;border-radius:0px;padding-top:0.5rem;padding-right:0.75rem;padding-bottom:0.5rem;padding-left:0.75rem;font-size:1rem;line-height:1.5rem;--tw-shadow:0 0 #0000}/*!@[type='text']:focus, input:where(:not([type])):focus, [type='email']:focus, [type='url']:focus, [type='password']:focus, [type='number']:focus, [type='date']:focus, [type='datetime-local']:focus, [type='month']:focus, [type='search']:focus, [type='tel']:focus, [type='time']:focus, [type='week']:focus, [multiple]:focus, textarea:focus, select:focus*/[type='text'].sc-salable-pricing-table:focus,input.sc-salable-pricing-table:where(:not([type])):focus,[type='email'].sc-salable-pricing-table:focus,[type='url'].sc-salable-pricing-table:focus,[type='password'].sc-salable-pricing-table:focus,[type='number'].sc-salable-pricing-table:focus,[type='date'].sc-salable-pricing-table:focus,[type='datetime-local'].sc-salable-pricing-table:focus,[type='month'].sc-salable-pricing-table:focus,[type='search'].sc-salable-pricing-table:focus,[type='tel'].sc-salable-pricing-table:focus,[type='time'].sc-salable-pricing-table:focus,[type='week'].sc-salable-pricing-table:focus,[multiple].sc-salable-pricing-table:focus,textarea.sc-salable-pricing-table:focus,select.sc-salable-pricing-table:focus{outline:2px solid transparent;outline-offset:2px;--tw-ring-inset:var(--tw-empty, );--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:#2563eb;--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);border-color:#2563eb}/*!@input::-moz-placeholder, textarea::-moz-placeholder*/input.sc-salable-pricing-table::-moz-placeholder,textarea.sc-salable-pricing-table::-moz-placeholder{color:#6b7280;opacity:1}/*!@input::placeholder,textarea::placeholder*/input.sc-salable-pricing-table::placeholder,textarea.sc-salable-pricing-table::placeholder{color:#6b7280;opacity:1}/*!@::-webkit-datetime-edit-fields-wrapper*/.sc-salable-pricing-table::-webkit-datetime-edit-fields-wrapper{padding:0}/*!@::-webkit-date-and-time-value*/.sc-salable-pricing-table::-webkit-date-and-time-value{min-height:1.5em;text-align:inherit}/*!@::-webkit-datetime-edit*/.sc-salable-pricing-table::-webkit-datetime-edit{display:inline-flex}/*!@::-webkit-datetime-edit,::-webkit-datetime-edit-year-field,::-webkit-datetime-edit-month-field,::-webkit-datetime-edit-day-field,::-webkit-datetime-edit-hour-field,::-webkit-datetime-edit-minute-field,::-webkit-datetime-edit-second-field,::-webkit-datetime-edit-millisecond-field,::-webkit-datetime-edit-meridiem-field*/.sc-salable-pricing-table::-webkit-datetime-edit,.sc-salable-pricing-table::-webkit-datetime-edit-year-field,.sc-salable-pricing-table::-webkit-datetime-edit-month-field,.sc-salable-pricing-table::-webkit-datetime-edit-day-field,.sc-salable-pricing-table::-webkit-datetime-edit-hour-field,.sc-salable-pricing-table::-webkit-datetime-edit-minute-field,.sc-salable-pricing-table::-webkit-datetime-edit-second-field,.sc-salable-pricing-table::-webkit-datetime-edit-millisecond-field,.sc-salable-pricing-table::-webkit-datetime-edit-meridiem-field{padding-top:0;padding-bottom:0}/*!@select*/select.sc-salable-pricing-table{background-image:url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\");background-position:right 0.5rem center;background-repeat:no-repeat;background-size:1.5em 1.5em;padding-right:2.5rem;-webkit-print-color-adjust:exact;print-color-adjust:exact}/*!@[multiple],[size]:where(select:not([size=\"1\"]))*/[multiple].sc-salable-pricing-table,[size].sc-salable-pricing-table:where(select:not([size=\"1\"])){background-image:initial;background-position:initial;background-repeat:unset;background-size:initial;padding-right:0.75rem;-webkit-print-color-adjust:unset;print-color-adjust:unset}/*!@[type='checkbox'],[type='radio']*/[type='checkbox'].sc-salable-pricing-table,[type='radio'].sc-salable-pricing-table{-webkit-appearance:none;-moz-appearance:none;appearance:none;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;display:inline-block;vertical-align:middle;background-origin:border-box;-webkit-user-select:none;-moz-user-select:none;user-select:none;flex-shrink:0;height:1rem;width:1rem;color:#2563eb;background-color:#fff;border-color:#6b7280;border-width:1px;--tw-shadow:0 0 #0000}/*!@[type='checkbox']*/[type='checkbox'].sc-salable-pricing-table{border-radius:0px}/*!@[type='radio']*/[type='radio'].sc-salable-pricing-table{border-radius:100%}/*!@[type='checkbox']:focus,[type='radio']:focus*/[type='checkbox'].sc-salable-pricing-table:focus,[type='radio'].sc-salable-pricing-table:focus{outline:2px solid transparent;outline-offset:2px;--tw-ring-inset:var(--tw-empty, );--tw-ring-offset-width:2px;--tw-ring-offset-color:#fff;--tw-ring-color:#2563eb;--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}/*!@[type='checkbox']:checked,[type='radio']:checked*/[type='checkbox'].sc-salable-pricing-table:checked,[type='radio'].sc-salable-pricing-table:checked{border-color:transparent;background-color:currentColor;background-size:100% 100%;background-position:center;background-repeat:no-repeat}/*!@[type='checkbox']:checked*/[type='checkbox'].sc-salable-pricing-table:checked{background-image:url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e\")}@media (forced-colors: active){/*!@[type='checkbox']:checked*/[type='checkbox'].sc-salable-pricing-table:checked{-webkit-appearance:auto;-moz-appearance:auto;appearance:auto}}/*!@[type='radio']:checked*/[type='radio'].sc-salable-pricing-table:checked{background-image:url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='3'/%3e%3c/svg%3e\")}@media (forced-colors: active){/*!@[type='radio']:checked*/[type='radio'].sc-salable-pricing-table:checked{-webkit-appearance:auto;-moz-appearance:auto;appearance:auto}}/*!@[type='checkbox']:checked:hover,[type='checkbox']:checked:focus,[type='radio']:checked:hover,[type='radio']:checked:focus*/[type='checkbox'].sc-salable-pricing-table:checked:hover,[type='checkbox'].sc-salable-pricing-table:checked:focus,[type='radio'].sc-salable-pricing-table:checked:hover,[type='radio'].sc-salable-pricing-table:checked:focus{border-color:transparent;background-color:currentColor}/*!@[type='checkbox']:indeterminate*/[type='checkbox'].sc-salable-pricing-table:indeterminate{background-image:url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 16'%3e%3cpath stroke='white' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 8h8'/%3e%3c/svg%3e\");border-color:transparent;background-color:currentColor;background-size:100% 100%;background-position:center;background-repeat:no-repeat}@media (forced-colors: active){/*!@[type='checkbox']:indeterminate*/[type='checkbox'].sc-salable-pricing-table:indeterminate{-webkit-appearance:auto;-moz-appearance:auto;appearance:auto}}/*!@[type='checkbox']:indeterminate:hover,[type='checkbox']:indeterminate:focus*/[type='checkbox'].sc-salable-pricing-table:indeterminate:hover,[type='checkbox'].sc-salable-pricing-table:indeterminate:focus{border-color:transparent;background-color:currentColor}/*!@[type='file']*/[type='file'].sc-salable-pricing-table{background:unset;border-color:inherit;border-width:0;border-radius:0;padding:0;font-size:unset;line-height:inherit}/*!@[type='file']:focus*/[type='file'].sc-salable-pricing-table:focus{outline:1px solid ButtonText;outline:1px auto -webkit-focus-ring-color}/*!@*, ::before, ::after*/*.sc-salable-pricing-table,.sc-salable-pricing-table::before,.sc-salable-pricing-table::after{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*!@::backdrop*/.sc-salable-pricing-table::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*!@.sr-only*/.sr-only.sc-salable-pricing-table{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;border-width:0}/*!@.invisible*/.invisible.sc-salable-pricing-table{visibility:hidden}/*!@.fixed*/.fixed.sc-salable-pricing-table{position:fixed}/*!@.absolute*/.absolute.sc-salable-pricing-table{position:absolute}/*!@.relative*/.relative.sc-salable-pricing-table{position:relative}/*!@.bottom-6*/.bottom-6.sc-salable-pricing-table{bottom:1.5rem}/*!@.left-0*/.left-0.sc-salable-pricing-table{left:0px}/*!@.left-1\\/2*/.left-1\\/2.sc-salable-pricing-table{left:50%}/*!@.top-0*/.top-0.sc-salable-pricing-table{top:0px}/*!@.z-10*/.z-10.sc-salable-pricing-table{z-index:10}/*!@.mx-auto*/.mx-auto.sc-salable-pricing-table{margin-left:auto;margin-right:auto}/*!@.my-4*/.my-4.sc-salable-pricing-table{margin-top:1rem;margin-bottom:1rem}/*!@.mb-12*/.mb-12.sc-salable-pricing-table{margin-bottom:3rem}/*!@.mb-2*/.mb-2.sc-salable-pricing-table{margin-bottom:0.5rem}/*!@.mb-4*/.mb-4.sc-salable-pricing-table{margin-bottom:1rem}/*!@.mb-5*/.mb-5.sc-salable-pricing-table{margin-bottom:1.25rem}/*!@.mb-6*/.mb-6.sc-salable-pricing-table{margin-bottom:1.5rem}/*!@.me-2*/.me-2.sc-salable-pricing-table{margin-inline-end:0.5rem}/*!@.me-3*/.me-3.sc-salable-pricing-table{margin-inline-end:0.75rem}/*!@.mr-4*/.mr-4.sc-salable-pricing-table{margin-right:1rem}/*!@.ms-3*/.ms-3.sc-salable-pricing-table{margin-inline-start:0.75rem}/*!@.mt-2*/.mt-2.sc-salable-pricing-table{margin-top:0.5rem}/*!@.mt-4*/.mt-4.sc-salable-pricing-table{margin-top:1rem}/*!@.mt-7*/.mt-7.sc-salable-pricing-table{margin-top:1.75rem}/*!@.mt-auto*/.mt-auto.sc-salable-pricing-table{margin-top:auto}/*!@.block*/.block.sc-salable-pricing-table{display:block}/*!@.inline-block*/.inline-block.sc-salable-pricing-table{display:inline-block}/*!@.flex*/.flex.sc-salable-pricing-table{display:flex}/*!@.inline-flex*/.inline-flex.sc-salable-pricing-table{display:inline-flex}/*!@.table*/.table.sc-salable-pricing-table{display:table}/*!@.grid*/.grid.sc-salable-pricing-table{display:grid}/*!@.h-6*/.h-6.sc-salable-pricing-table{height:1.5rem}/*!@.h-7*/.h-7.sc-salable-pricing-table{height:1.75rem}/*!@.h-full*/.h-full.sc-salable-pricing-table{height:100%}/*!@.w-6*/.w-6.sc-salable-pricing-table{width:1.5rem}/*!@.w-\\[3\\.25rem\\]*/.w-\\[3\\.25rem\\].sc-salable-pricing-table{width:3.25rem}/*!@.w-full*/.w-full.sc-salable-pricing-table{width:100%}/*!@.w-max*/.w-max.sc-salable-pricing-table{width:-moz-max-content;width:max-content}/*!@.min-w-\\[3\\.5rem\\]*/.min-w-\\[3\\.5rem\\].sc-salable-pricing-table{min-width:3.5rem}/*!@.max-w-\\[200px\\]*/.max-w-\\[200px\\].sc-salable-pricing-table{max-width:200px}/*!@.grow-0*/.grow-0.sc-salable-pricing-table{flex-grow:0}/*!@.-translate-x-1\\/2*/.-translate-x-1\\/2.sc-salable-pricing-table{--tw-translate-x:-50%;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}/*!@.transform*/.transform.sc-salable-pricing-table{transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}/*!@.cursor-pointer*/.cursor-pointer.sc-salable-pricing-table{cursor:pointer}/*!@.flex-col*/.flex-col.sc-salable-pricing-table{flex-direction:column}/*!@.items-center*/.items-center.sc-salable-pricing-table{align-items:center}/*!@.justify-center*/.justify-center.sc-salable-pricing-table{justify-content:center}/*!@.justify-between*/.justify-between.sc-salable-pricing-table{justify-content:space-between}/*!@.gap-2*/.gap-2.sc-salable-pricing-table{gap:0.5rem}/*!@.gap-6*/.gap-6.sc-salable-pricing-table{gap:1.5rem}/*!@.space-x-2 > :not([hidden]) ~ :not([hidden])*/.space-x-2.sc-salable-pricing-table>.sc-salable-pricing-table:not([hidden])~.sc-salable-pricing-table:not([hidden]){--tw-space-x-reverse:0;margin-right:calc(0.5rem * var(--tw-space-x-reverse));margin-left:calc(0.5rem * calc(1 - var(--tw-space-x-reverse)))}/*!@.space-y-2 > :not([hidden]) ~ :not([hidden])*/.space-y-2.sc-salable-pricing-table>.sc-salable-pricing-table:not([hidden])~.sc-salable-pricing-table:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(0.5rem * var(--tw-space-y-reverse))}/*!@.space-y-2\\.5 > :not([hidden]) ~ :not([hidden])*/.space-y-2\\.5.sc-salable-pricing-table>.sc-salable-pricing-table:not([hidden])~.sc-salable-pricing-table:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(0.625rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(0.625rem * var(--tw-space-y-reverse))}/*!@.overflow-hidden*/.overflow-hidden.sc-salable-pricing-table{overflow:hidden}/*!@.rounded-full*/.rounded-full.sc-salable-pricing-table{border-radius:9999px}/*!@.rounded-lg*/.rounded-lg.sc-salable-pricing-table{border-radius:0.5rem}/*!@.rounded-md*/.rounded-md.sc-salable-pricing-table{border-radius:0.375rem}/*!@.rounded-xl*/.rounded-xl.sc-salable-pricing-table{border-radius:0.75rem}/*!@.rounded-b*/.rounded-b.sc-salable-pricing-table{border-bottom-right-radius:0.25rem;border-bottom-left-radius:0.25rem}/*!@.border*/.border.sc-salable-pricing-table{border-width:1px}/*!@.border-2*/.border-2.sc-salable-pricing-table{border-width:2px}/*!@.border-t-0*/.border-t-0.sc-salable-pricing-table{border-top-width:0px}/*!@.border-t-4*/.border-t-4.sc-salable-pricing-table{border-top-width:4px}/*!@.border-solid*/.border-solid.sc-salable-pricing-table{border-style:solid}/*!@.border-gray-100*/.border-gray-100.sc-salable-pricing-table{--tw-border-opacity:1;border-color:rgb(243 244 246 / var(--tw-border-opacity))}/*!@.border-gray-200*/.border-gray-200.sc-salable-pricing-table{--tw-border-opacity:1;border-color:rgb(229 231 235 / var(--tw-border-opacity))}/*!@.border-gray-300*/.border-gray-300.sc-salable-pricing-table{--tw-border-opacity:1;border-color:rgb(209 213 219 / var(--tw-border-opacity))}/*!@.border-orange-500*/.border-orange-500.sc-salable-pricing-table{--tw-border-opacity:1;border-color:rgb(249 115 22 / var(--tw-border-opacity))}/*!@.border-red-300*/.border-red-300.sc-salable-pricing-table{--tw-border-opacity:1;border-color:rgb(252 165 165 / var(--tw-border-opacity))}/*!@.border-transparent*/.border-transparent.sc-salable-pricing-table{border-color:transparent}/*!@.bg-gray-200*/.bg-gray-200.sc-salable-pricing-table{--tw-bg-opacity:1;background-color:rgb(229 231 235 / var(--tw-bg-opacity))}/*!@.bg-gray-50*/.bg-gray-50.sc-salable-pricing-table{--tw-bg-opacity:1;background-color:rgb(249 250 251 / var(--tw-bg-opacity))}/*!@.bg-gray-900*/.bg-gray-900.sc-salable-pricing-table{--tw-bg-opacity:1;background-color:rgb(17 24 39 / var(--tw-bg-opacity))}/*!@.bg-orange-500*/.bg-orange-500.sc-salable-pricing-table{--tw-bg-opacity:1;background-color:rgb(249 115 22 / var(--tw-bg-opacity))}/*!@.bg-primary-600*/.bg-primary-600.sc-salable-pricing-table{background-color:var(--primary-600)}/*!@.bg-red-50*/.bg-red-50.sc-salable-pricing-table{--tw-bg-opacity:1;background-color:rgb(254 242 242 / var(--tw-bg-opacity))}/*!@.bg-white*/.bg-white.sc-salable-pricing-table{--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity))}/*!@.p-2*/.p-2.sc-salable-pricing-table{padding:0.5rem}/*!@.p-2\\.5*/.p-2\\.5.sc-salable-pricing-table{padding:0.625rem}/*!@.p-4*/.p-4.sc-salable-pricing-table{padding:1rem}/*!@.p-6*/.p-6.sc-salable-pricing-table{padding:1.5rem}/*!@.p-px*/.p-px.sc-salable-pricing-table{padding:1px}/*!@.px-1*/.px-1.sc-salable-pricing-table{padding-left:0.25rem;padding-right:0.25rem}/*!@.px-2*/.px-2.sc-salable-pricing-table{padding-left:0.5rem;padding-right:0.5rem}/*!@.px-3*/.px-3.sc-salable-pricing-table{padding-left:0.75rem;padding-right:0.75rem}/*!@.px-5*/.px-5.sc-salable-pricing-table{padding-left:1.25rem;padding-right:1.25rem}/*!@.py-0*/.py-0.sc-salable-pricing-table{padding-top:0px;padding-bottom:0px}/*!@.py-1*/.py-1.sc-salable-pricing-table{padding-top:0.25rem;padding-bottom:0.25rem}/*!@.py-2*/.py-2.sc-salable-pricing-table{padding-top:0.5rem;padding-bottom:0.5rem}/*!@.py-2\\.5*/.py-2\\.5.sc-salable-pricing-table{padding-top:0.625rem;padding-bottom:0.625rem}/*!@.py-20*/.py-20.sc-salable-pricing-table{padding-top:5rem;padding-bottom:5rem}/*!@.text-left*/.text-left.sc-salable-pricing-table{text-align:left}/*!@.text-center*/.text-center.sc-salable-pricing-table{text-align:center}/*!@.align-middle*/.align-middle.sc-salable-pricing-table{vertical-align:middle}/*!@.font-sans*/.font-sans.sc-salable-pricing-table{font-family:\"PT Sans\", sans-serif}/*!@.text-2xl*/.text-2xl.sc-salable-pricing-table{font-size:1.5rem;line-height:2rem}/*!@.text-5xl*/.text-5xl.sc-salable-pricing-table{font-size:3rem;line-height:1}/*!@.text-\\[9px\\]*/.text-\\[9px\\].sc-salable-pricing-table{font-size:9px}/*!@.text-base*/.text-base.sc-salable-pricing-table{font-size:1rem;line-height:1.5rem}/*!@.text-lg*/.text-lg.sc-salable-pricing-table{font-size:1.125rem;line-height:1.75rem}/*!@.text-sm*/.text-sm.sc-salable-pricing-table{font-size:0.875rem;line-height:1.25rem}/*!@.text-xl*/.text-xl.sc-salable-pricing-table{font-size:1.25rem;line-height:1.75rem}/*!@.text-xs*/.text-xs.sc-salable-pricing-table{font-size:0.75rem;line-height:1rem}/*!@.font-bold*/.font-bold.sc-salable-pricing-table{font-weight:700}/*!@.font-medium*/.font-medium.sc-salable-pricing-table{font-weight:500}/*!@.font-semibold*/.font-semibold.sc-salable-pricing-table{font-weight:600}/*!@.uppercase*/.uppercase.sc-salable-pricing-table{text-transform:uppercase}/*!@.text-black*/.text-black.sc-salable-pricing-table{--tw-text-opacity:1;color:rgb(0 0 0 / var(--tw-text-opacity))}/*!@.text-gray-500*/.text-gray-500.sc-salable-pricing-table{--tw-text-opacity:1;color:rgb(107 114 128 / var(--tw-text-opacity))}/*!@.text-gray-700*/.text-gray-700.sc-salable-pricing-table{--tw-text-opacity:1;color:rgb(55 65 81 / var(--tw-text-opacity))}/*!@.text-gray-800*/.text-gray-800.sc-salable-pricing-table{--tw-text-opacity:1;color:rgb(31 41 55 / var(--tw-text-opacity))}/*!@.text-gray-900*/.text-gray-900.sc-salable-pricing-table{--tw-text-opacity:1;color:rgb(17 24 39 / var(--tw-text-opacity))}/*!@.text-primary-600*/.text-primary-600.sc-salable-pricing-table{color:var(--primary-600)}/*!@.text-red-600*/.text-red-600.sc-salable-pricing-table{--tw-text-opacity:1;color:rgb(220 38 38 / var(--tw-text-opacity))}/*!@.text-red-800*/.text-red-800.sc-salable-pricing-table{--tw-text-opacity:1;color:rgb(153 27 27 / var(--tw-text-opacity))}/*!@.text-transparent*/.text-transparent.sc-salable-pricing-table{color:transparent}/*!@.text-white*/.text-white.sc-salable-pricing-table{--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity))}/*!@.opacity-0*/.opacity-0.sc-salable-pricing-table{opacity:0}/*!@.shadow*/.shadow.sc-salable-pricing-table{--tw-shadow:0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}/*!@.shadow-sm*/.shadow-sm.sc-salable-pricing-table{--tw-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05);--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}/*!@.shadow-xl*/.shadow-xl.sc-salable-pricing-table{--tw-shadow:0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);--tw-shadow-colored:0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}/*!@.transition-all*/.transition-all.sc-salable-pricing-table{transition-property:all;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms}/*!@.transition-colors*/.transition-colors.sc-salable-pricing-table{transition-property:color, background-color, border-color, text-decoration-color, fill, stroke;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms}/*!@.duration-200*/.duration-200.sc-salable-pricing-table{transition-duration:200ms}/*!@.ease-in-out*/.ease-in-out.sc-salable-pricing-table{transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1)}/*!@:host*/.sc-salable-pricing-table-h{display:block;text-align:left;--primary-50:#BCCAFD;--primary-100:#A8BBFC;--primary-200:#819BFB;--primary-300:#597CF9;--primary-400:#325DF8;--primary-500:#0B3EF7;--primary-600:#0733D1;--primary-700:#0629AA;--primary-800:#042082;--primary-900:#03165B;--primary-950:#021147}/*!@.before\\:inline-block::before*/.before\\:inline-block.sc-salable-pricing-table::before{content:var(--tw-content);display:inline-block}/*!@.before\\:h-6::before*/.before\\:h-6.sc-salable-pricing-table::before{content:var(--tw-content);height:1.5rem}/*!@.before\\:w-6::before*/.before\\:w-6.sc-salable-pricing-table::before{content:var(--tw-content);width:1.5rem}/*!@.before\\:translate-x-0::before*/.before\\:translate-x-0.sc-salable-pricing-table::before{content:var(--tw-content);--tw-translate-x:0px;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}/*!@.before\\:transform::before*/.before\\:transform.sc-salable-pricing-table::before{content:var(--tw-content);transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}/*!@.before\\:rounded-full::before*/.before\\:rounded-full.sc-salable-pricing-table::before{content:var(--tw-content);border-radius:9999px}/*!@.before\\:bg-white::before*/.before\\:bg-white.sc-salable-pricing-table::before{content:var(--tw-content);--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity))}/*!@.before\\:shadow::before*/.before\\:shadow.sc-salable-pricing-table::before{content:var(--tw-content);--tw-shadow:0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}/*!@.before\\:ring-0::before*/.before\\:ring-0.sc-salable-pricing-table::before{content:var(--tw-content);--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)}/*!@.before\\:transition::before*/.before\\:transition.sc-salable-pricing-table::before{content:var(--tw-content);transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms}/*!@.before\\:duration-200::before*/.before\\:duration-200.sc-salable-pricing-table::before{content:var(--tw-content);transition-duration:200ms}/*!@.before\\:ease-in-out::before*/.before\\:ease-in-out.sc-salable-pricing-table::before{content:var(--tw-content);transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1)}/*!@.checked\\:border-primary-600:checked*/.checked\\:border-primary-600.sc-salable-pricing-table:checked{border-color:var(--primary-600)}/*!@.checked\\:bg-none:checked*/.checked\\:bg-none.sc-salable-pricing-table:checked{background-image:none}/*!@.checked\\:text-primary-600:checked*/.checked\\:text-primary-600.sc-salable-pricing-table:checked{color:var(--primary-600)}/*!@.checked\\:before\\:translate-x-full:checked::before*/.checked\\:before\\:translate-x-full.sc-salable-pricing-table:checked::before{content:var(--tw-content);--tw-translate-x:100%;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}/*!@.checked\\:before\\:bg-white:checked::before*/.checked\\:before\\:bg-white.sc-salable-pricing-table:checked::before{content:var(--tw-content);--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity))}/*!@.hover\\:bg-gray-50:hover*/.hover\\:bg-gray-50.sc-salable-pricing-table:hover{--tw-bg-opacity:1;background-color:rgb(249 250 251 / var(--tw-bg-opacity))}/*!@.hover\\:bg-primary-700:hover*/.hover\\:bg-primary-700.sc-salable-pricing-table:hover{background-color:var(--primary-700)}/*!@.hover\\:bg-primary-800:hover*/.hover\\:bg-primary-800.sc-salable-pricing-table:hover{background-color:var(--primary-800)}/*!@.focus\\:border-primary-500:focus*/.focus\\:border-primary-500.sc-salable-pricing-table:focus{border-color:var(--primary-500)}/*!@.focus\\:outline-none:focus*/.focus\\:outline-none.sc-salable-pricing-table:focus{outline:2px solid transparent;outline-offset:2px}/*!@.focus\\:ring-2:focus*/.focus\\:ring-2.sc-salable-pricing-table:focus{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)}/*!@.focus\\:ring-4:focus*/.focus\\:ring-4.sc-salable-pricing-table:focus{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)}/*!@.focus\\:ring-blue-600:focus*/.focus\\:ring-blue-600.sc-salable-pricing-table:focus{--tw-ring-opacity:1;--tw-ring-color:rgb(37 99 235 / var(--tw-ring-opacity))}/*!@.focus\\:ring-primary-200:focus*/.focus\\:ring-primary-200.sc-salable-pricing-table:focus{--tw-ring-color:var(--primary-200)}/*!@.focus\\:ring-primary-300:focus*/.focus\\:ring-primary-300.sc-salable-pricing-table:focus{--tw-ring-color:var(--primary-300)}/*!@.focus\\:ring-primary-500:focus*/.focus\\:ring-primary-500.sc-salable-pricing-table:focus{--tw-ring-color:var(--primary-500)}/*!@.focus\\:ring-primary-600:focus*/.focus\\:ring-primary-600.sc-salable-pricing-table:focus{--tw-ring-color:var(--primary-600)}/*!@.focus\\:ring-offset-2:focus*/.focus\\:ring-offset-2.sc-salable-pricing-table:focus{--tw-ring-offset-width:2px}/*!@.focus\\:ring-offset-white:focus*/.focus\\:ring-offset-white.sc-salable-pricing-table:focus{--tw-ring-offset-color:#fff}/*!@.focus\\:checked\\:border-primary-600:checked:focus*/.focus\\:checked\\:border-primary-600.sc-salable-pricing-table:checked:focus{border-color:var(--primary-600)}/*!@.disabled\\:pointer-events-none:disabled*/.disabled\\:pointer-events-none.sc-salable-pricing-table:disabled{pointer-events:none}/*!@.disabled\\:opacity-50:disabled*/.disabled\\:opacity-50.sc-salable-pricing-table:disabled{opacity:0.5}/*!@.group:hover .group-hover\\:visible*/.group.sc-salable-pricing-table:hover .group-hover\\:visible.sc-salable-pricing-table{visibility:visible}/*!@.group:hover .group-hover\\:opacity-100*/.group.sc-salable-pricing-table:hover .group-hover\\:opacity-100.sc-salable-pricing-table{opacity:1}/*!@.group:focus .group-focus\\:visible*/.group.sc-salable-pricing-table:focus .group-focus\\:visible.sc-salable-pricing-table{visibility:visible}/*!@.group:focus .group-focus\\:opacity-100*/.group.sc-salable-pricing-table:focus .group-focus\\:opacity-100.sc-salable-pricing-table{opacity:1}@media (min-width: 640px){/*!@.sm\\:grid-cols-1*/.sm\\:grid-cols-1.sc-salable-pricing-table{grid-template-columns:repeat(1, minmax(0, 1fr))}/*!@.sm\\:grid-cols-2*/.sm\\:grid-cols-2.sc-salable-pricing-table{grid-template-columns:repeat(2, minmax(0, 1fr))}}@media (min-width: 1024px){/*!@.lg\\:grid-cols-1*/.lg\\:grid-cols-1.sc-salable-pricing-table{grid-template-columns:repeat(1, minmax(0, 1fr))}/*!@.lg\\:grid-cols-2*/.lg\\:grid-cols-2.sc-salable-pricing-table{grid-template-columns:repeat(2, minmax(0, 1fr))}/*!@.lg\\:grid-cols-3*/.lg\\:grid-cols-3.sc-salable-pricing-table{grid-template-columns:repeat(3, minmax(0, 1fr))}/*!@.lg\\:grid-cols-4*/.lg\\:grid-cols-4.sc-salable-pricing-table{grid-template-columns:repeat(4, minmax(0, 1fr))}/*!@.lg\\:items-center*/.lg\\:items-center.sc-salable-pricing-table{align-items:center}}@media (min-width: 1280px){/*!@.xl\\:p-8*/.xl\\:p-8.sc-salable-pricing-table{padding:2rem}}@media (prefers-color-scheme: dark){/*!@.dark\\:border-gray-600*/.dark\\:border-gray-600.sc-salable-pricing-table{--tw-border-opacity:1;border-color:rgb(75 85 99 / var(--tw-border-opacity))}/*!@.dark\\:border-gray-700*/.dark\\:border-gray-700.sc-salable-pricing-table{--tw-border-opacity:1;border-color:rgb(55 65 81 / var(--tw-border-opacity))}/*!@.dark\\:border-red-800*/.dark\\:border-red-800.sc-salable-pricing-table{--tw-border-opacity:1;border-color:rgb(153 27 27 / var(--tw-border-opacity))}/*!@.dark\\:bg-gray-700*/.dark\\:bg-gray-700.sc-salable-pricing-table{--tw-bg-opacity:1;background-color:rgb(55 65 81 / var(--tw-bg-opacity))}/*!@.dark\\:bg-gray-800*/.dark\\:bg-gray-800.sc-salable-pricing-table{--tw-bg-opacity:1;background-color:rgb(31 41 55 / var(--tw-bg-opacity))}/*!@.dark\\:bg-primary-600*/.dark\\:bg-primary-600.sc-salable-pricing-table{background-color:var(--primary-600)}/*!@.dark\\:bg-slate-900*/.dark\\:bg-slate-900.sc-salable-pricing-table{--tw-bg-opacity:1;background-color:rgb(15 23 42 / var(--tw-bg-opacity))}/*!@.dark\\:text-gray-200*/.dark\\:text-gray-200.sc-salable-pricing-table{--tw-text-opacity:1;color:rgb(229 231 235 / var(--tw-text-opacity))}/*!@.dark\\:text-gray-400*/.dark\\:text-gray-400.sc-salable-pricing-table{--tw-text-opacity:1;color:rgb(156 163 175 / var(--tw-text-opacity))}/*!@.dark\\:text-red-400*/.dark\\:text-red-400.sc-salable-pricing-table{--tw-text-opacity:1;color:rgb(248 113 113 / var(--tw-text-opacity))}/*!@.dark\\:text-white*/.dark\\:text-white.sc-salable-pricing-table{--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity))}/*!@.dark\\:placeholder-gray-400::-moz-placeholder*/.dark\\:placeholder-gray-400.sc-salable-pricing-table::-moz-placeholder{--tw-placeholder-opacity:1;color:rgb(156 163 175 / var(--tw-placeholder-opacity))}/*!@.dark\\:placeholder-gray-400::placeholder*/.dark\\:placeholder-gray-400.sc-salable-pricing-table::placeholder{--tw-placeholder-opacity:1;color:rgb(156 163 175 / var(--tw-placeholder-opacity))}/*!@.dark\\:before\\:bg-gray-400::before*/.dark\\:before\\:bg-gray-400.sc-salable-pricing-table::before{content:var(--tw-content);--tw-bg-opacity:1;background-color:rgb(156 163 175 / var(--tw-bg-opacity))}/*!@.dark\\:checked\\:border-primary-500:checked*/.dark\\:checked\\:border-primary-500.sc-salable-pricing-table:checked{border-color:var(--primary-500)}/*!@.dark\\:checked\\:bg-primary-500:checked*/.dark\\:checked\\:bg-primary-500.sc-salable-pricing-table:checked{background-color:var(--primary-500)}/*!@.dark\\:checked\\:before\\:bg-white:checked::before*/.dark\\:checked\\:before\\:bg-white.sc-salable-pricing-table:checked::before{content:var(--tw-content);--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity))}/*!@.dark\\:hover\\:bg-primary-700:hover*/.dark\\:hover\\:bg-primary-700.sc-salable-pricing-table:hover{background-color:var(--primary-700)}/*!@.dark\\:hover\\:bg-slate-800:hover*/.dark\\:hover\\:bg-slate-800.sc-salable-pricing-table:hover{--tw-bg-opacity:1;background-color:rgb(30 41 59 / var(--tw-bg-opacity))}/*!@.dark\\:hover\\:text-white:hover*/.dark\\:hover\\:text-white.sc-salable-pricing-table:hover{--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity))}/*!@.dark\\:focus\\:border-primary-500:focus*/.dark\\:focus\\:border-primary-500.sc-salable-pricing-table:focus{border-color:var(--primary-500)}/*!@.dark\\:focus\\:ring-primary-500:focus*/.dark\\:focus\\:ring-primary-500.sc-salable-pricing-table:focus{--tw-ring-color:var(--primary-500)}/*!@.dark\\:focus\\:ring-primary-800:focus*/.dark\\:focus\\:ring-primary-800.sc-salable-pricing-table:focus{--tw-ring-color:var(--primary-800)}/*!@.dark\\:focus\\:ring-primary-900:focus*/.dark\\:focus\\:ring-primary-900.sc-salable-pricing-table:focus{--tw-ring-color:var(--primary-900)}/*!@.dark\\:focus\\:ring-offset-gray-600:focus*/.dark\\:focus\\:ring-offset-gray-600.sc-salable-pricing-table:focus{--tw-ring-offset-color:#4b5563}/*!@.dark\\:focus\\:ring-offset-gray-800:focus*/.dark\\:focus\\:ring-offset-gray-800.sc-salable-pricing-table:focus{--tw-ring-offset-color:#1f2937}}";
var SalablePricingTableStyle0 = salablePricingTableCss;

class SalablePricingTable {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.handleToggleBillingPeriod = (event) => {
            this.selectedBillingPeriodKey = event.target.checked ? 'yearly' : 'monthly';
        };
        this.handleToggleBillingPeriodMonthly = (event) => {
            event.preventDefault();
            this.toggleIntervalEl.checked = false;
            this.selectedBillingPeriodKey = 'monthly';
        };
        this.handleToggleBillingPeriodYearly = (event) => {
            event.preventDefault();
            this.toggleIntervalEl.checked = true;
            this.selectedBillingPeriodKey = 'yearly';
        };
        this.handlePlanSelect = (plan) => async (event) => {
            event.preventDefault();
            if (plan.checkoutUrl) {
                window.location = plan.checkoutUrl;
            }
            else {
                await this.createLicenses(plan);
            }
        };
        this.createLicenses = async (plan) => {
            const body = Array.from({ length: plan.perSeatAmount }, () => ({
                planUuid: plan.uuid,
                member: this.member,
                granteeId: null,
                ...(this.customerEmail && { email: this.customerEmail }),
            }));
            const granteeId = this.planConfig.granteeIds.find(([planUuid]) => planUuid === plan.uuid)?.[1] ?? this.globalGranteeId;
            const successUrl = this.planConfig.successUrls.find(([planUuid]) => planUuid === plan.uuid)?.[1] ?? this.globalSuccessUrl;
            const cancelUrl = this.planConfig.cancelUrls.find(([planUuid]) => planUuid === plan.uuid)?.[1] ?? this.globalCancelUrl;
            body[0].granteeId = granteeId;
            try {
                const licensesResponse = await fetch(`${apiUrl}/licenses`, {
                    method: 'POST',
                    headers: { 'x-api-key': this.apiKey },
                    body: JSON.stringify(body),
                });
                if (licensesResponse.status === 200) {
                    location.href = successUrl;
                }
                else {
                    console.error('Salable Pricing Table Error: License create did not return a success response');
                    location.href = cancelUrl;
                }
            }
            catch (e) {
                console.error('Salable Pricing Table Error: Failed to create license/s');
                this.errorMessage = 'Failed to select plan';
                location.href = cancelUrl;
            }
        };
        this.getColumnCount = () => {
            const columnLookup = {
                1: 'sm:grid-cols-1 lg:grid-cols-1',
                2: 'sm:grid-cols-2 lg:grid-cols-2',
                3: 'sm:grid-cols-2 lg:grid-cols-3',
                4: 'sm:grid-cols-2 lg:grid-cols-4',
            };
            switch (this.selectedBillingPeriodKey) {
                case 'monthly':
                    return columnLookup[this.calculateColumnCount(this.state.monthly.length)];
                case 'yearly':
                    return columnLookup[this.calculateColumnCount(this.state.yearly.length)];
            }
        };
        this.calculateColumnCount = (length) => length <= 4 ? length : length % 4 === 0 ? 4 : 3;
        this.planConfig = null;
        this.state = null;
        this.errorMessage = null;
        this.selectedBillingPeriodKey = 'monthly';
        this.apiKey = undefined;
        this.uuid = undefined;
        this.isCustomPricingTable = false;
        this.globalSuccessUrl = undefined;
        this.globalCancelUrl = undefined;
        this.globalGranteeId = undefined;
        this.member = undefined;
        this.promoCode = undefined;
        this.allowPromoCode = undefined;
        this.customerEmail = undefined;
        this.customerId = undefined;
        this.currency = undefined;
        this.automaticTax = undefined;
        this.perPlanGranteeIds = undefined;
        this.perPlanSuccessUrls = undefined;
        this.perPlanCancelUrls = undefined;
    }
    validateProp(newValue, propName) {
        if (typeof newValue !== 'string' || newValue.trim() === '') {
            throw new Error(`${propName} is a required property and cannot be empty`);
        }
    }
    perPlanGranteeIdsWatcher(newValue) {
        if (!Boolean(newValue)) {
            this._perPlanGranteeIds = undefined;
            return;
        }
        if (typeof newValue === 'string') {
            this._perPlanGranteeIds = JSON.parse(newValue);
            return;
        }
        for (const value of Object.values(newValue)) {
            if (typeof value !== 'string') {
                throw new Error('All perPlanGranteeIds values must be strings');
            }
        }
        this._perPlanGranteeIds = newValue;
    }
    perPlanSuccessUrlsWatcher(newValue) {
        if (!Boolean(newValue)) {
            this._perPlanSuccessUrls = undefined;
            return;
        }
        if (typeof newValue === 'string') {
            this._perPlanSuccessUrls = JSON.parse(newValue);
            return;
        }
        for (const value of Object.values(newValue)) {
            if (typeof value !== 'string') {
                throw new Error('All perPlanSuccessUrls values must be strings');
            }
        }
        this._perPlanSuccessUrls = newValue;
    }
    perPlanCancelUrlsWatcher(newValue) {
        if (!Boolean(newValue)) {
            this._perPlanCancelUrls = undefined;
            return;
        }
        if (typeof newValue === 'string') {
            this._perPlanCancelUrls = JSON.parse(newValue);
            return;
        }
        for (const value of Object.values(newValue)) {
            if (typeof value !== 'string') {
                throw new Error('All perPlanCancelUrls values must be strings');
            }
        }
        this._perPlanCancelUrls = newValue;
    }
    async componentWillLoad() {
        this.validateProps();
        this.perPlanGranteeIdsWatcher(this.perPlanGranteeIds);
        this.perPlanSuccessUrlsWatcher(this.perPlanSuccessUrls);
        this.perPlanCancelUrlsWatcher(this.perPlanCancelUrls);
        this.initPlanConfig();
        const data = await this.fetchPricingTable();
        if (Boolean(data)) {
            const normalisedData = this.pricingTableFactory(data);
            this.state = this.initialiseState(normalisedData);
        }
    }
    render() {
        const isTestMode = this.apiKey.startsWith('test_');
        return (hAsync(Host, { key: 'e73483aa92965b47dd82733b954b2de5f3688f58' }, hAsync("div", { key: '8dfa778f8806d0c5608cf431a646443254e57217', class: "font-sans relative" }, isTestMode ? (hAsync("div", { class: "mb-4 border-solid border-t-4 border-orange-500 w-full flex justify-center" }, hAsync("p", { class: "px-1 bg-orange-500 rounded-b font-bold text-white uppercase text-xs" }, "test mode"))) : null, this.errorMessage, this.state.monthly.length > 0 && this.state.yearly.length > 0 ? (hAsync("section", { class: "flex justify-center items-center mb-12" }, hAsync("label", { class: "min-w-[3.5rem] text-sm text-gray-500 me-3 dark:text-gray-400", htmlfor: "interval-toggle", onClick: this.handleToggleBillingPeriodMonthly }, "Monthly"), hAsync("input", { type: "checkbox", id: "interval-toggle", class: "relative w-[3.25rem] h-7 p-px bg-gray-200 border-transparent text-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:ring-primary-600 disabled:opacity-50 disabled:pointer-events-none checked:bg-none checked:text-primary-600 checked:border-primary-600 focus:checked:border-primary-600 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-primary-500 dark:checked:border-primary-500 dark:focus:ring-offset-gray-600 before:inline-block before:w-6 before:h-6 before:bg-white checked:before:bg-white before:translate-x-0 checked:before:translate-x-full before:rounded-full before:shadow before:transform before:ring-0 before:transition before:ease-in-out before:duration-200 dark:before:bg-gray-400 dark:checked:before:bg-white", ref: (el) => {
                this.toggleIntervalEl = el;
            }, onInput: this.handleToggleBillingPeriod }), hAsync("label", { class: "relative min-w-[3.5rem] text-sm text-gray-500 ms-3 dark:text-gray-400", htmlfor: "interval-toggle", onClick: this.handleToggleBillingPeriodYearly }, "Annual"))) : null, hAsync("div", { key: 'db9d81e0abb985332e9457501afd9791a7536fc8', class: `grid ${this.getColumnCount()} gap-6 lg:items-center` }, this.state[this.selectedBillingPeriodKey].map(({ plan }, planIndex) => (hAsync("section", { class: this.getCardClass(plan), "data-testid": `pricing-table-card-${planIndex}` }, hAsync("h3", { class: "font-medium text-lg text-gray-800 dark:text-gray-200", id: "pricing-table-card-heading" }, plan.name), plan.currencies.length > 0 ? (hAsync("div", { class: 'mt-4' }, hAsync("span", { class: "font-bold text-2xl" }, this.getCurrency(plan)?.currency.symbol), hAsync("span", { class: "font-bold text-5xl text-gray-800 dark:text-gray-200" }, this.calcPrice(this.getCurrency(plan)?.price)), hAsync("span", { class: "text-xl text-grey-500" }, " per ", this.planUnitValue(plan.licenseType, plan.interval)))) : (hAsync("div", { class: 'mt-4' }, hAsync("span", { class: "font-bold text-5xl text-gray-800 dark:text-gray-200" }, "Free"))), hAsync("p", { class: "mt-2 text-sm text-gray-500" }, plan.description), hAsync("ul", { class: "mt-7 mb-5 space-y-2.5 text-sm mx-auto" }, plan.features?.map((feature, featureIndex) => (hAsync("li", { class: "flex space-x-2 flex-col items-center" }, hAsync("h4", { class: "text-gray-800 dark:text-gray-400 text-left flex gap-2 items-center font-semibold" }, feature.feature.displayName, Boolean(feature.feature.description) ? (hAsync("div", { "data-testid": `info_${planIndex}_${featureIndex}`, class: "grow-0 flex items-center group relative mr-4", tabindex: "0" }, hAsync("span", { class: "text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-full text-[9px] px-2 py-0 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" }, "?"), hAsync("div", { "data-testid": `tooltip_${planIndex}_${featureIndex}`, role: "tooltip", class: "absolute w-max max-w-[200px] bottom-6 z-10 invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus:visible group-focus:opacity-100 inline-block px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-sm tooltip dark:bg-gray-700" }, feature.feature.description))) : null), this.getFeatureValue(feature.feature.valueType, feature.value, feature.isUnlimited, feature.feature.showUnlimited, feature.enumValue?.name))))), hAsync("button", { class: "mt-auto inline-flex justify-center items-center text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900", onClick: this.handlePlanSelect(plan) }, "Select Plan"))))))));
    }
    validateProps() {
        this.validateProp(this.apiKey, 'apiKey');
        this.validateProp(this.uuid, 'uuid');
        this.validateProp(this.globalSuccessUrl, 'globalSuccessUrl');
        this.validateProp(this.globalCancelUrl, 'globalCancelUrl');
        this.validateProp(this.globalGranteeId, 'globalGranteeId');
        this.validateProp(this.member, 'member');
    }
    async fetchPricingTable() {
        try {
            const params = new URLSearchParams({
                globalSuccessUrl: this.globalSuccessUrl,
                globalCancelUrl: this.globalCancelUrl,
                globalGranteeId: this.globalGranteeId,
                member: this.member,
            });
            if (Boolean(this.promoCode)) {
                params.set('promoCode', this.promoCode);
            }
            if (Boolean(this.allowPromoCode)) {
                params.set('allowPromoCode', this.allowPromoCode);
            }
            if (Boolean(this.automaticTax)) {
                params.set('automaticTax', this.automaticTax);
            }
            if (Boolean(this.customerEmail)) {
                params.set('customerEmail', this.customerEmail);
            }
            if (Boolean(this.customerId)) {
                params.set('customerId', this.customerId);
            }
            if (Boolean(this.currency)) {
                params.set('currency', this.currency);
            }
            if (Boolean(this.planConfig)) {
                if (this.planConfig.granteeIds.length > 0)
                    params.set('granteeIds', this.planConfig.granteeIds.flat().join(','));
                if (this.planConfig.successUrls.length > 0)
                    params.set('successUrls', this.planConfig.successUrls.flat().join(','));
                if (this.planConfig.cancelUrls.length > 0)
                    params.set('cancelUrls', this.planConfig.cancelUrls.flat().join(','));
            }
            const pricingTableUrl = this.isCustomPricingTable
                ? `${apiUrl}/pricing-tables/${this.uuid}?${decodeURIComponent(params.toString())}`
                : `${apiUrl}/products/${this.uuid}/pricingtable?${decodeURIComponent(params.toString())}`;
            const response = await fetch(pricingTableUrl, { headers: { 'x-api-key': `${this.apiKey}` } });
            if (!response.ok) {
                // Todo: add refresh/retry option
                // Todo: 401 Unauthenticated | 403 Unauthorised (when API is fixed)
                if (response.status === 401 || response.status === 403) {
                    this.errorMessage = 'Unauthorised';
                    return null;
                }
                if (response.status === 404) {
                    this.errorMessage = 'Not found';
                    return null;
                }
            }
            return response.json();
        }
        catch (error) {
            // Todo: add refresh/retry option
            console.error('Fetch error:', error);
            this.errorMessage = 'Error fetching data';
            return null;
        }
    }
    initialiseState(data) {
        const result = {
            monthly: [],
            yearly: [],
            featuredPlanUuid: data.featuredPlanUuid,
            defaultCurrencyShortName: this.getPricingTableDefaultCurrency(data),
        };
        for (let plan of data.plans) {
            switch (plan.plan.interval) {
                case 'year':
                    result.yearly.push(plan);
                    break;
                case 'month':
                    result.monthly.push(plan);
                    break;
            }
        }
        if (result.monthly.length === 0 && result.yearly.length > 0) {
            this.selectedBillingPeriodKey = 'yearly';
        }
        return result;
    }
    getPricingTableDefaultCurrency(data) {
        return this.currency ?? data.product.currencies.find((currency) => currency.defaultCurrency)?.currency.shortName ?? null;
    }
    getCurrency(plan) {
        return plan.currencies.find(currenciesOnPlan => currenciesOnPlan.currency.shortName === this.state.defaultCurrencyShortName);
    }
    planUnitValue(licenseType, interval) {
        switch (licenseType) {
            case 'licensed':
                return interval;
            case 'metered':
                return 'unit';
            case 'perSeat':
                return 'seat';
            default:
                return null;
        }
    }
    initPlanConfig() {
        this.planConfig = {
            granteeIds: [],
            successUrls: [],
            cancelUrls: [],
        };
        if (Boolean(this._perPlanGranteeIds)) {
            this.planConfig.granteeIds = Object.entries(this._perPlanGranteeIds);
        }
        if (Boolean(this._perPlanSuccessUrls)) {
            this.planConfig.successUrls = Object.entries(this._perPlanSuccessUrls);
        }
        if (Boolean(this._perPlanCancelUrls)) {
            this.planConfig.cancelUrls = Object.entries(this._perPlanCancelUrls);
        }
    }
    getCardClass(plan) {
        return plan.uuid === this.state.featuredPlanUuid ?
            "h-full flex flex-col p-6 text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white shadow-xl border-2" :
            "h-full flex flex-col p-6 text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white";
    }
    pricingTableFactory(pricingTable) {
        if (!this.isCustomPricingTable) {
            return {
                featuredPlanUuid: '',
                product: { currencies: pricingTable.currencies },
                plans: pricingTable.plans.map((plan) => ({ plan }))
            };
        }
        return pricingTable;
    }
    calcPrice(price) {
        const decimal = price / 100;
        return decimal % 1 === 0 ? decimal.toString() : decimal.toFixed(2);
    }
    getFeatureValue(valueType, value, isUnlimited, showUnlimited, enumValue) {
        switch (valueType) {
            case "numerical":
                return showUnlimited && isUnlimited ? 'Unlimited' : value;
            case "enum":
                return enumValue ?? 'n/a';
            case "boolean":
                return value === 'true' ? (hAsync("svg", { class: "w-6 h-6 text-primary-600", "aria-hidden": "true", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24" }, hAsync("path", { stroke: "currentColor", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "m5 12 4.7 4.5 9.3-9" }))) : (hAsync("svg", { class: "w-6 h-6 text-primary-600", "aria-hidden": "true", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24" }, hAsync("path", { stroke: "currentColor", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M6 18 18 6m0 12L6 6" })));
        }
    }
    static get watchers() { return {
        "apiKey": ["validateProp"],
        "uuid": ["validateProp"],
        "globalSuccessUrl": ["validateProp"],
        "globalCancelUrl": ["validateProp"],
        "globalGranteeId": ["validateProp"],
        "member": ["validateProp"],
        "perPlanGranteeIds": ["perPlanGranteeIdsWatcher"],
        "perPlanSuccessUrls": ["perPlanSuccessUrlsWatcher"],
        "perPlanCancelUrls": ["perPlanCancelUrlsWatcher"]
    }; }
    static get style() { return SalablePricingTableStyle0; }
    static get cmpMeta() { return {
        "$flags$": 9,
        "$tagName$": "salable-pricing-table",
        "$members$": {
            "apiKey": [1, "api-key"],
            "uuid": [1],
            "isCustomPricingTable": [4, "is-custom-pricing-table"],
            "globalSuccessUrl": [1, "global-success-url"],
            "globalCancelUrl": [1, "global-cancel-url"],
            "globalGranteeId": [1, "global-grantee-id"],
            "member": [1],
            "promoCode": [1, "promo-code"],
            "allowPromoCode": [1, "allow-promo-code"],
            "customerEmail": [1, "customer-email"],
            "customerId": [1, "customer-id"],
            "currency": [1],
            "automaticTax": [1, "automatic-tax"],
            "perPlanGranteeIds": [1, "per-plan-grantee-ids"],
            "perPlanSuccessUrls": [1, "per-plan-success-urls"],
            "perPlanCancelUrls": [1, "per-plan-cancel-urls"],
            "planConfig": [32],
            "state": [32],
            "errorMessage": [32],
            "selectedBillingPeriodKey": [32]
        },
        "$listeners$": undefined,
        "$lazyBundleId$": "-",
        "$attrsToReflect$": []
    }; }
}

registerComponents([
  SalableButton,
  SalableCheckout,
  SalablePricingTable,
]);

exports.hydrateApp = hydrateApp;


    /*hydrateAppClosure end*/
    hydrateApp(window, $stencilHydrateOpts, $stencilHydrateResults, $stencilAfterHydrate, $stencilHydrateResolve);
  }

  hydrateAppClosure($stencilWindow);
}

function createWindowFromHtml(e, t) {
 let r = templateWindows.get(t);
 return null == r && (r = new MockWindow(e), templateWindows.set(t, r)), cloneWindow(r);
}

function inspectElement(e, t, r) {
 const s = t.children;
 for (let t = 0, n = s.length; t < n; t++) {
  const n = s[t], o = n.nodeName.toLowerCase();
  if (o.includes("-")) {
   const t = e.components.find((e => e.tag === o));
   null != t && (t.count++, r > t.depth && (t.depth = r));
  } else switch (o) {
  case "a":
   const t = collectAttributes(n);
   t.href = n.href, "string" == typeof t.href && (e.anchors.some((e => e.href === t.href)) || e.anchors.push(t));
   break;

  case "img":
   const r = collectAttributes(n);
   r.src = n.src, "string" == typeof r.src && (e.imgs.some((e => e.src === r.src)) || e.imgs.push(r));
   break;

  case "link":
   const s = collectAttributes(n);
   s.href = n.href, "string" == typeof s.rel && "stylesheet" === s.rel.toLowerCase() && "string" == typeof s.href && (e.styles.some((e => e.link === s.href)) || (delete s.rel, 
   delete s.type, e.styles.push(s)));
   break;

  case "script":
   const o = collectAttributes(n);
   if (n.hasAttribute("src")) o.src = n.src, "string" == typeof o.src && (e.scripts.some((e => e.src === o.src)) || e.scripts.push(o)); else {
    const t = n.getAttribute("data-stencil-static");
    t && e.staticData.push({
     id: t,
     type: n.getAttribute("type"),
     content: n.textContent
    });
   }
  }
  inspectElement(e, n, ++r);
 }
}

function collectAttributes(e) {
 const t = {}, r = e.attributes;
 for (let e = 0, s = r.length; e < s; e++) {
  const s = r.item(e), n = s.nodeName.toLowerCase();
  if (SKIP_ATTRS.has(n)) continue;
  const o = s.nodeValue;
  "class" === n && "" === o || (t[n] = o);
 }
 return t;
}

function patchDomImplementation(e, t) {
 let r;
 if (null != e.defaultView ? (t.destroyWindow = !0, patchWindow(e.defaultView), r = e.defaultView) : (t.destroyWindow = !0, 
 t.destroyDocument = !1, r = new MockWindow(!1)), r.document !== e && (r.document = e), 
 e.defaultView !== r && (e.defaultView = r), "function" != typeof e.documentElement.constructor.prototype.getRootNode && (e.createElement("unknown-element").constructor.prototype.getRootNode = getRootNode), 
 "function" == typeof e.createEvent) {
  const t = e.createEvent("CustomEvent").constructor;
  r.CustomEvent !== t && (r.CustomEvent = t);
 }
 try {
  r.__stencil_baseURI = e.baseURI;
 } catch (t) {
  Object.defineProperty(e, "baseURI", {
   get() {
    const t = e.querySelector("base[href]");
    return t ? new URL(t.getAttribute("href"), r.location.href).href : r.location.href;
   }
  });
 }
 return r;
}

function getRootNode(e) {
 const t = null != e && !0 === e.composed;
 let r = this;
 for (;null != r.parentNode; ) r = r.parentNode, !0 === t && null == r.parentNode && null != r.host && (r = r.host);
 return r;
}

function normalizeHydrateOptions(e) {
 const t = Object.assign({
  serializeToHtml: !1,
  destroyWindow: !1,
  destroyDocument: !1
 }, e || {});
 return "boolean" != typeof t.clientHydrateAnnotations && (t.clientHydrateAnnotations = !0), 
 "boolean" != typeof t.constrainTimeouts && (t.constrainTimeouts = !0), "number" != typeof t.maxHydrateCount && (t.maxHydrateCount = 300), 
 "boolean" != typeof t.runtimeLogging && (t.runtimeLogging = !1), "number" != typeof t.timeout && (t.timeout = 15e3), 
 Array.isArray(t.excludeComponents) ? t.excludeComponents = t.excludeComponents.filter(filterValidTags).map(mapValidTags) : t.excludeComponents = [], 
 Array.isArray(t.staticComponents) ? t.staticComponents = t.staticComponents.filter(filterValidTags).map(mapValidTags) : t.staticComponents = [], 
 t;
}

function filterValidTags(e) {
 return "string" == typeof e && e.includes("-");
}

function mapValidTags(e) {
 return e.trim().toLowerCase();
}

function generateHydrateResults(e) {
 "string" != typeof e.url && (e.url = "https://hydrate.stenciljs.com/"), "string" != typeof e.buildId && (e.buildId = createHydrateBuildId());
 const t = {
  buildId: e.buildId,
  diagnostics: [],
  url: e.url,
  host: null,
  hostname: null,
  href: null,
  pathname: null,
  port: null,
  search: null,
  hash: null,
  html: null,
  httpStatus: null,
  hydratedCount: 0,
  anchors: [],
  components: [],
  imgs: [],
  scripts: [],
  staticData: [],
  styles: [],
  title: null
 };
 try {
  const r = new URL(e.url, "https://hydrate.stenciljs.com/");
  t.url = r.href, t.host = r.host, t.hostname = r.hostname, t.href = r.href, t.port = r.port, 
  t.pathname = r.pathname, t.search = r.search, t.hash = r.hash;
 } catch (e) {
  renderCatchError(t, e);
 }
 return t;
}

function renderBuildDiagnostic(e, t, r, s) {
 const n = {
  level: t,
  type: "build",
  header: r,
  messageText: s,
  relFilePath: void 0,
  absFilePath: void 0,
  lines: []
 };
 return e.pathname ? "/" !== e.pathname && (n.header += ": " + e.pathname) : e.url && (n.header += ": " + e.url), 
 e.diagnostics.push(n), n;
}

function renderBuildError(e, t) {
 return renderBuildDiagnostic(e, "error", "Hydrate Error", t);
}

function renderCatchError(e, t) {
 const r = renderBuildError(e, null);
 return null != t && (null != t.stack ? r.messageText = t.stack.toString() : null != t.message ? r.messageText = t.message.toString() : r.messageText = t.toString()), 
 r;
}

function runtimeLog(e, t, r) {
 global.console[t].apply(global.console, [ `[ ${e}  ${t} ] `, ...r ]);
}

function renderToString(e, t) {
 const r = normalizeHydrateOptions(t);
 return r.serializeToHtml = !0, new Promise((t => {
  let s;
  const n = generateHydrateResults(r);
  if (hasError(n.diagnostics)) t(n); else if ("string" == typeof e) try {
   r.destroyWindow = !0, r.destroyDocument = !0, s = new MockWindow(e), render(s, r, n, t);
  } catch (e) {
   s && s.close && s.close(), s = null, renderCatchError(n, e), t(n);
  } else if (isValidDocument(e)) try {
   r.destroyDocument = !1, s = patchDomImplementation(e, r), render(s, r, n, t);
  } catch (e) {
   s && s.close && s.close(), s = null, renderCatchError(n, e), t(n);
  } else renderBuildError(n, 'Invalid html or document. Must be either a valid "html" string, or DOM "document".'), 
  t(n);
 }));
}

function hydrateDocument(e, t) {
 const r = normalizeHydrateOptions(t);
 return r.serializeToHtml = !1, new Promise((t => {
  let s;
  const n = generateHydrateResults(r);
  if (hasError(n.diagnostics)) t(n); else if ("string" == typeof e) try {
   r.destroyWindow = !0, r.destroyDocument = !0, s = new MockWindow(e), render(s, r, n, t);
  } catch (e) {
   s && s.close && s.close(), s = null, renderCatchError(n, e), t(n);
  } else if (isValidDocument(e)) try {
   r.destroyDocument = !1, s = patchDomImplementation(e, r), render(s, r, n, t);
  } catch (e) {
   s && s.close && s.close(), s = null, renderCatchError(n, e), t(n);
  } else renderBuildError(n, 'Invalid html or document. Must be either a valid "html" string, or DOM "document".'), 
  t(n);
 }));
}

function render(e, t, r, s) {
 if (process.__stencilErrors || (process.__stencilErrors = !0, process.on("unhandledRejection", (e => {
  console.log("unhandledRejection", e);
 }))), function n(e, t, r, s) {
  try {
   e.location.href = r.url;
  } catch (e) {
   renderCatchError(s, e);
  }
  if ("string" == typeof r.userAgent) try {
   e.navigator.userAgent = r.userAgent;
  } catch (e) {}
  if ("string" == typeof r.cookie) try {
   t.cookie = r.cookie;
  } catch (e) {}
  if ("string" == typeof r.referrer) try {
   t.referrer = r.referrer;
  } catch (e) {}
  if ("string" == typeof r.direction) try {
   t.documentElement.setAttribute("dir", r.direction);
  } catch (e) {}
  if ("string" == typeof r.language) try {
   t.documentElement.setAttribute("lang", r.language);
  } catch (e) {}
  if ("string" == typeof r.buildId) try {
   t.documentElement.setAttribute("data-stencil-build", r.buildId);
  } catch (e) {}
  try {
   e.customElements = null;
  } catch (e) {}
  return r.constrainTimeouts && constrainTimeouts(e), function n(e, t, r) {
   try {
    const s = e.location.pathname;
    e.console.error = (...e) => {
     const n = e.reduce(((e, t) => {
      if (t) {
       if (null != t.stack) return e + " " + String(t.stack);
       if (null != t.message) return e + " " + String(t.message);
      }
      return String(t);
     }), "").trim();
     "" !== n && (renderCatchError(r, n), t.runtimeLogging && runtimeLog(s, "error", [ n ]));
    }, e.console.debug = (...e) => {
     renderBuildDiagnostic(r, "debug", "Hydrate Debug", [ ...e ].join(", ")), t.runtimeLogging && runtimeLog(s, "debug", e);
    }, t.runtimeLogging && [ "log", "warn", "assert", "info", "trace" ].forEach((t => {
     e.console[t] = (...e) => {
      runtimeLog(s, t, e);
     };
    }));
   } catch (e) {
    renderCatchError(r, e);
   }
  }(e, r, s), e;
 }(e, e.document, t, r), "function" == typeof t.beforeHydrate) try {
  const n = t.beforeHydrate(e.document);
  isPromise(n) ? n.then((() => {
   hydrateFactory(e, t, r, afterHydrate, s);
  })) : hydrateFactory(e, t, r, afterHydrate, s);
 } catch (n) {
  renderCatchError(r, n), finalizeHydrate(e, e.document, t, r, s);
 } else hydrateFactory(e, t, r, afterHydrate, s);
}

function afterHydrate(e, t, r, s) {
 if ("function" == typeof t.afterHydrate) try {
  const n = t.afterHydrate(e.document);
  isPromise(n) ? n.then((() => {
   finalizeHydrate(e, e.document, t, r, s);
  })) : finalizeHydrate(e, e.document, t, r, s);
 } catch (n) {
  renderCatchError(r, n), finalizeHydrate(e, e.document, t, r, s);
 } else finalizeHydrate(e, e.document, t, r, s);
}

function finalizeHydrate(e, t, r, s, n) {
 try {
  if (inspectElement(s, t.documentElement, 0), !1 !== r.removeUnusedStyles) try {
   removeUnusedStyles(t, s.diagnostics);
  } catch (e) {
   renderCatchError(s, e);
  }
  if ("string" == typeof r.title) try {
   t.title = r.title;
  } catch (e) {
   renderCatchError(s, e);
  }
  s.title = t.title, r.removeScripts && removeScripts(t.documentElement);
  try {
   updateCanonicalLink(t, r.canonicalUrl);
  } catch (e) {
   renderCatchError(s, e);
  }
  try {
   relocateMetaCharset(t);
  } catch (e) {}
  hasError(s.diagnostics) || (s.httpStatus = 200);
  try {
   const e = t.head.querySelector('meta[http-equiv="status"]');
   if (null != e) {
    const t = e.getAttribute("content");
    t && t.length > 0 && (s.httpStatus = parseInt(t, 10));
   }
  } catch (e) {}
  r.clientHydrateAnnotations && t.documentElement.classList.add("hydrated"), r.serializeToHtml && (s.html = serializeDocumentToString(t, r));
 } catch (e) {
  renderCatchError(s, e);
 }
 if (r.destroyWindow) try {
  r.destroyDocument || (e.document = null, t.defaultView = null), e.close && e.close();
 } catch (e) {
  renderCatchError(s, e);
 }
 n(s);
}

function serializeDocumentToString(e, t) {
 return serializeNodeToHtml(e, {
  approximateLineWidth: t.approximateLineWidth,
  outerHtml: !1,
  prettyHtml: t.prettyHtml,
  removeAttributeQuotes: t.removeAttributeQuotes,
  removeBooleanAttributeQuotes: t.removeBooleanAttributeQuotes,
  removeEmptyAttributes: t.removeEmptyAttributes,
  removeHtmlComments: t.removeHtmlComments,
  serializeShadowRoot: !1
 });
}

function isValidDocument(e) {
 return null != e && 9 === e.nodeType && null != e.documentElement && 1 === e.documentElement.nodeType && null != e.body && 1 === e.body.nodeType;
}

function removeScripts(e) {
 const t = e.children;
 for (let e = t.length - 1; e >= 0; e--) {
  const r = t[e];
  removeScripts(r), ("SCRIPT" === r.nodeName || "LINK" === r.nodeName && "modulepreload" === r.getAttribute("rel")) && r.remove();
 }
}

const templateWindows = new Map, isPromise = e => !!e && ("object" == typeof e || "function" == typeof e) && "function" == typeof e.then, hasError = e => null != e && 0 !== e.length && e.some((e => "error" === e.level && "runtime" !== e.type)), TASK_CANCELED_MSG = "task canceled", updateCanonicalLink = (e, t) => {
 let r = e.head.querySelector('link[rel="canonical"]');
 "string" == typeof t ? (null == r && (r = e.createElement("link"), r.setAttribute("rel", "canonical"), 
 e.head.appendChild(r)), r.setAttribute("href", t)) : null != r && (r.getAttribute("href") || r.parentNode.removeChild(r));
}, relocateMetaCharset = e => {
 const t = e.head;
 let r = t.querySelector("meta[charset]");
 null == r ? (r = e.createElement("meta"), r.setAttribute("charset", "utf-8")) : r.remove(), 
 t.insertBefore(r, t.firstChild);
}, parseCss = (e, t) => {
 let r = 1, s = 1;
 const n = [], o = e => {
  const t = e.match(/\n/g);
  t && (r += t.length);
  const n = e.lastIndexOf("\n");
  s = ~n ? e.length - n : s + e.length;
 }, i = () => {
  const e = {
   line: r,
   column: s
  };
  return t => (t.position = new A(e), m(), t);
 }, a = o => {
  const i = e.split("\n"), a = {
   level: "error",
   type: "css",
   language: "css",
   header: "CSS Parse",
   messageText: o,
   absFilePath: t,
   lines: [ {
    lineIndex: r - 1,
    lineNumber: r,
    errorCharStart: s,
    text: e[r - 1]
   } ]
  };
  if (r > 1) {
   const t = {
    lineIndex: r - 1,
    lineNumber: r - 1,
    text: e[r - 2],
    errorCharStart: -1,
    errorLength: -1
   };
   a.lines.unshift(t);
  }
  if (r + 2 < i.length) {
   const e = {
    lineIndex: r,
    lineNumber: r + 1,
    text: i[r],
    errorCharStart: -1,
    errorLength: -1
   };
   a.lines.push(e);
  }
  return n.push(a), null;
 }, l = () => u(/^{\s*/), c = () => u(/^}/), u = t => {
  const r = t.exec(e);
  if (!r) return;
  const s = r[0];
  return o(s), e = e.slice(s.length), r;
 }, d = () => {
  let t;
  const r = [];
  for (m(), h(r); e.length && "}" !== e.charAt(0) && (t = T() || w()); ) r.push(t), 
  h(r);
  return r;
 }, m = () => u(/^\s*/), h = e => {
  let t;
  for (e = e || []; t = p(); ) e.push(t);
  return e;
 }, p = () => {
  const t = i();
  if ("/" !== e.charAt(0) || "*" !== e.charAt(1)) return null;
  let r = 2;
  for (;"" !== e.charAt(r) && ("*" !== e.charAt(r) || "/" !== e.charAt(r + 1)); ) ++r;
  if (r += 2, "" === e.charAt(r - 1)) return a("End of comment missing");
  const n = e.slice(2, r - 2);
  return s += 2, o(n), e = e.slice(r), s += 2, t({
   type: 1,
   comment: n
  });
 }, f = () => {
  const e = u(/^([^{]+)/);
  return e ? trim(e[0]).replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*\/+/g, "").replace(/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'/g, (function(e) {
   return e.replace(/,/g, "‌");
  })).split(/\s*(?![^(]*\)),\s*/).map((function(e) {
   return e.replace(/\u200C/g, ",");
  })) : null;
 }, g = () => {
  const e = i();
  let t = u(/^(\*?[-#\/\*\\\w]+(\[[0-9a-z_-]+\])?)\s*/);
  if (!t) return null;
  if (t = trim(t[0]), !u(/^:\s*/)) return a("property missing ':'");
  const r = u(/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^\)]*?\)|[^};])+)/), s = e({
   type: 4,
   property: t.replace(commentre, ""),
   value: r ? trim(r[0]).replace(commentre, "") : ""
  });
  return u(/^[;\s]*/), s;
 }, y = () => {
  const e = [];
  if (!l()) return a("missing '{'");
  let t;
  for (h(e); t = g(); ) e.push(t), h(e);
  return c() ? e : a("missing '}'");
 }, C = () => {
  let e;
  const t = [], r = i();
  for (;e = u(/^((\d+\.\d+|\.\d+|\d+)%?|[a-z]+)\s*/); ) t.push(e[1]), u(/^,\s*/);
  return t.length ? r({
   type: 9,
   values: t,
   declarations: y()
  }) : null;
 }, S = (e, t) => {
  const r = new RegExp("^@" + e + "\\s*([^;]+);");
  return () => {
   const s = i(), n = u(r);
   if (!n) return null;
   const o = {
    type: t
   };
   return o[e] = n[1].trim(), s(o);
  };
 }, E = S("import", 7), b = S("charset", 0), v = S("namespace", 11), T = () => "@" !== e[0] ? null : (() => {
  const e = i();
  let t = u(/^@([-\w]+)?keyframes\s*/);
  if (!t) return null;
  const r = t[1];
  if (t = u(/^([-\w]+)\s*/), !t) return a("@keyframes missing name");
  const s = t[1];
  if (!l()) return a("@keyframes missing '{'");
  let n, o = h();
  for (;n = C(); ) o.push(n), o = o.concat(h());
  return c() ? e({
   type: 8,
   name: s,
   vendor: r,
   keyframes: o
  }) : a("@keyframes missing '}'");
 })() || (() => {
  const e = i(), t = u(/^@media *([^{]+)/);
  if (!t) return null;
  const r = trim(t[1]);
  if (!l()) return a("@media missing '{'");
  const s = h().concat(d());
  return c() ? e({
   type: 10,
   media: r,
   rules: s
  }) : a("@media missing '}'");
 })() || (() => {
  const e = i(), t = u(/^@custom-media\s+(--[^\s]+)\s*([^{;]+);/);
  return t ? e({
   type: 2,
   name: trim(t[1]),
   media: trim(t[2])
  }) : null;
 })() || (() => {
  const e = i(), t = u(/^@supports *([^{]+)/);
  if (!t) return null;
  const r = trim(t[1]);
  if (!l()) return a("@supports missing '{'");
  const s = h().concat(d());
  return c() ? e({
   type: 15,
   supports: r,
   rules: s
  }) : a("@supports missing '}'");
 })() || E() || b() || v() || (() => {
  const e = i(), t = u(/^@([-\w]+)?document *([^{]+)/);
  if (!t) return null;
  const r = trim(t[1]), s = trim(t[2]);
  if (!l()) return a("@document missing '{'");
  const n = h().concat(d());
  return c() ? e({
   type: 3,
   document: s,
   vendor: r,
   rules: n
  }) : a("@document missing '}'");
 })() || (() => {
  const e = i();
  if (!u(/^@page */)) return null;
  const t = f() || [];
  if (!l()) return a("@page missing '{'");
  let r, s = h();
  for (;r = g(); ) s.push(r), s = s.concat(h());
  return c() ? e({
   type: 12,
   selectors: t,
   declarations: s
  }) : a("@page missing '}'");
 })() || (() => {
  const e = i();
  if (!u(/^@host\s*/)) return null;
  if (!l()) return a("@host missing '{'");
  const t = h().concat(d());
  return c() ? e({
   type: 6,
   rules: t
  }) : a("@host missing '}'");
 })() || (() => {
  const e = i();
  if (!u(/^@font-face\s*/)) return null;
  if (!l()) return a("@font-face missing '{'");
  let t, r = h();
  for (;t = g(); ) r.push(t), r = r.concat(h());
  return c() ? e({
   type: 5,
   declarations: r
  }) : a("@font-face missing '}'");
 })(), w = () => {
  const e = i(), t = f();
  return t ? (h(), e({
   type: 13,
   selectors: t,
   declarations: y()
  })) : a("selector missing");
 };
 class A {
  constructor(e) {
   this.start = e, this.end = {
    line: r,
    column: s
   }, this.source = t;
  }
 }
 return A.prototype.content = e, {
  diagnostics: n,
  ...addParent((() => {
   const e = d();
   return {
    type: 14,
    stylesheet: {
     source: t,
     rules: e
    }
   };
  })())
 };
}, trim = e => e ? e.trim() : "", addParent = (e, t) => {
 const r = e && "string" == typeof e.type, s = r ? e : t;
 for (const t in e) {
  const r = e[t];
  Array.isArray(r) ? r.forEach((function(e) {
   addParent(e, s);
  })) : r && "object" == typeof r && addParent(r, s);
 }
 return r && Object.defineProperty(e, "parent", {
  configurable: !0,
  writable: !0,
  enumerable: !1,
  value: t || null
 }), e;
}, commentre = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g, getCssSelectors = e => {
 SELECTORS.all.length = SELECTORS.tags.length = SELECTORS.classNames.length = SELECTORS.ids.length = SELECTORS.attrs.length = 0;
 const t = (e = e.replace(/\./g, " .").replace(/\#/g, " #").replace(/\[/g, " [").replace(/\>/g, " > ").replace(/\+/g, " + ").replace(/\~/g, " ~ ").replace(/\*/g, " * ").replace(/\:not\((.*?)\)/g, " ")).split(" ");
 for (let e = 0, r = t.length; e < r; e++) t[e] = t[e].split(":")[0], 0 !== t[e].length && ("." === t[e].charAt(0) ? SELECTORS.classNames.push(t[e].slice(1)) : "#" === t[e].charAt(0) ? SELECTORS.ids.push(t[e].slice(1)) : "[" === t[e].charAt(0) ? (t[e] = t[e].slice(1).split("=")[0].split("]")[0].trim(), 
 SELECTORS.attrs.push(t[e].toLowerCase())) : /[a-z]/g.test(t[e].charAt(0)) && SELECTORS.tags.push(t[e].toLowerCase()));
 return SELECTORS.classNames = SELECTORS.classNames.sort(((e, t) => e.length < t.length ? -1 : e.length > t.length ? 1 : 0)), 
 SELECTORS;
}, SELECTORS = {
 all: [],
 tags: [],
 classNames: [],
 ids: [],
 attrs: []
}, serializeCssVisitNode = (e, t, r, s) => {
 var n;
 const o = t.type;
 return 4 === o ? serializeCssDeclaration(t, r, s) : 13 === o ? serializeCssRule(e, t) : 1 === o ? "!" === (null === (n = t.comment) || void 0 === n ? void 0 : n[0]) ? `/*${t.comment}*/` : "" : 10 === o ? serializeCssMedia(e, t) : 8 === o ? serializeCssKeyframes(e, t) : 9 === o ? serializeCssKeyframe(e, t) : 5 === o ? serializeCssFontFace(e, t) : 15 === o ? serializeCssSupports(e, t) : 7 === o ? "@import " + t.import + ";" : 0 === o ? "@charset " + t.charset + ";" : 12 === o ? serializeCssPage(e, t) : 6 === o ? "@host{" + serializeCssMapVisit(e, t.rules) + "}" : 2 === o ? "@custom-media " + t.name + " " + t.media + ";" : 3 === o ? serializeCssDocument(e, t) : 11 === o ? "@namespace " + t.namespace + ";" : "";
}, serializeCssRule = (e, t) => {
 var r, s;
 const n = t.declarations, o = e.usedSelectors, i = null !== (s = null === (r = t.selectors) || void 0 === r ? void 0 : r.slice()) && void 0 !== s ? s : [];
 if (null == n || 0 === n.length) return "";
 if (o) {
  let t, r, s = !0;
  for (t = i.length - 1; t >= 0; t--) {
   const n = getCssSelectors(i[t]);
   s = !0;
   let a = n.classNames.length;
   if (a > 0 && e.hasUsedClassNames) for (r = 0; r < a; r++) if (!o.classNames.has(n.classNames[r])) {
    s = !1;
    break;
   }
   if (s && e.hasUsedTags && (a = n.tags.length, a > 0)) for (r = 0; r < a; r++) if (!o.tags.has(n.tags[r])) {
    s = !1;
    break;
   }
   if (s && e.hasUsedAttrs && (a = n.attrs.length, a > 0)) for (r = 0; r < a; r++) if (!o.attrs.has(n.attrs[r])) {
    s = !1;
    break;
   }
   if (s && e.hasUsedIds && (a = n.ids.length, a > 0)) for (r = 0; r < a; r++) if (!o.ids.has(n.ids[r])) {
    s = !1;
    break;
   }
   s || i.splice(t, 1);
  }
 }
 if (0 === i.length) return "";
 const a = [];
 let l = "";
 if (t.selectors) for (const e of t.selectors) l = removeSelectorWhitespace(e), a.includes(l) || a.push(l);
 return `${a}{${serializeCssMapVisit(e, n)}}`;
}, serializeCssDeclaration = (e, t, r) => "" === e.value ? "" : r - 1 === t ? e.property + ":" + e.value : e.property + ":" + e.value + ";", serializeCssMedia = (e, t) => {
 const r = serializeCssMapVisit(e, t.rules);
 return "" === r ? "" : "@media " + removeMediaWhitespace(t.media) + "{" + r + "}";
}, serializeCssKeyframes = (e, t) => {
 const r = serializeCssMapVisit(e, t.keyframes);
 return "" === r ? "" : "@" + (t.vendor || "") + "keyframes " + t.name + "{" + r + "}";
}, serializeCssKeyframe = (e, t) => {
 var r, s;
 return (null !== (s = null === (r = t.values) || void 0 === r ? void 0 : r.join(",")) && void 0 !== s ? s : "") + "{" + serializeCssMapVisit(e, t.declarations) + "}";
}, serializeCssFontFace = (e, t) => {
 const r = serializeCssMapVisit(e, t.declarations);
 return "" === r ? "" : "@font-face{" + r + "}";
}, serializeCssSupports = (e, t) => {
 const r = serializeCssMapVisit(e, t.rules);
 return "" === r ? "" : "@supports " + t.supports + "{" + r + "}";
}, serializeCssPage = (e, t) => {
 var r, s;
 return "@page " + (null !== (s = null === (r = t.selectors) || void 0 === r ? void 0 : r.join(", ")) && void 0 !== s ? s : "") + "{" + serializeCssMapVisit(e, t.declarations) + "}";
}, serializeCssDocument = (e, t) => {
 const r = serializeCssMapVisit(e, t.rules), s = "@" + (t.vendor || "") + "document " + t.document;
 return "" === r ? "" : s + "{" + r + "}";
}, serializeCssMapVisit = (e, t) => {
 let r = "";
 if (t) for (let s = 0, n = t.length; s < n; s++) r += serializeCssVisitNode(e, t[s], s, n);
 return r;
}, removeSelectorWhitespace = e => {
 let t = "", r = "", s = !1;
 for (let n = 0, o = (e = e.trim()).length; n < o; n++) if (r = e[n], "[" === r && "\\" !== t[t.length - 1] ? s = !0 : "]" === r && "\\" !== t[t.length - 1] && (s = !1), 
 !s && CSS_WS_REG.test(r)) {
  if (CSS_NEXT_CHAR_REG.test(e[n + 1])) continue;
  if (CSS_PREV_CHAR_REG.test(t[t.length - 1])) continue;
  t += " ";
 } else t += r;
 return t;
}, removeMediaWhitespace = e => {
 var t;
 let r = "", s = "";
 for (let n = 0, o = (e = null !== (t = null == e ? void 0 : e.trim()) && void 0 !== t ? t : "").length; n < o; n++) if (s = e[n], 
 CSS_WS_REG.test(s)) {
  if (CSS_WS_REG.test(r[r.length - 1])) continue;
  r += " ";
 } else r += s;
 return r;
}, CSS_WS_REG = /\s/, CSS_NEXT_CHAR_REG = /[>\(\)\~\,\+\s]/, CSS_PREV_CHAR_REG = /[>\(\~\,\+]/, collectUsedSelectors = (e, t) => {
 if (null != t && 1 === t.nodeType) {
  const r = t.children, s = t.nodeName.toLowerCase();
  e.tags.add(s);
  const n = t.attributes;
  for (let r = 0, s = n.length; r < s; r++) {
   const s = n.item(r), o = s.name.toLowerCase();
   if (e.attrs.add(o), "class" === o) {
    const r = t.classList;
    for (let t = 0, s = r.length; t < s; t++) e.classNames.add(r.item(t));
   } else "id" === o && e.ids.add(s.value);
  }
  if (r) for (let t = 0, s = r.length; t < s; t++) collectUsedSelectors(e, r[t]);
 }
}, removeUnusedStyles = (e, t) => {
 try {
  const r = e.head.querySelectorAll("style[data-styles]"), s = r.length;
  if (s > 0) {
   const n = (e => {
    const t = {
     attrs: new Set,
     classNames: new Set,
     ids: new Set,
     tags: new Set
    };
    return collectUsedSelectors(t, e), t;
   })(e.documentElement);
   for (let e = 0; e < s; e++) removeUnusedStyleText(n, t, r[e]);
  }
 } catch (e) {
  ((e, t, r) => {
   const s = {
    level: "error",
    type: "build",
    header: "Build Error",
    messageText: "build error",
    lines: []
   };
   null != t && (null != t.stack ? s.messageText = t.stack.toString() : null != t.message ? s.messageText = t.message.length ? t.message : "UNKNOWN ERROR" : s.messageText = t.toString()), 
   null == e || (e => e === TASK_CANCELED_MSG)(s.messageText) || e.push(s);
  })(t, e);
 }
}, removeUnusedStyleText = (e, t, r) => {
 try {
  const s = parseCss(r.innerHTML);
  if (t.push(...s.diagnostics), hasError(t)) return;
  try {
   r.innerHTML = ((e, t) => {
    const r = t.usedSelectors || null, s = {
     usedSelectors: r || null,
     hasUsedAttrs: !!r && r.attrs.size > 0,
     hasUsedClassNames: !!r && r.classNames.size > 0,
     hasUsedIds: !!r && r.ids.size > 0,
     hasUsedTags: !!r && r.tags.size > 0
    }, n = e.rules;
    if (!n) return "";
    const o = n.length, i = [];
    for (let e = 0; e < o; e++) i.push(serializeCssVisitNode(s, n[e], e, o));
    return i.join("");
   })(s.stylesheet, {
    usedSelectors: e
   });
  } catch (e) {
   t.push({
    level: "warn",
    type: "css",
    header: "CSS Stringify",
    messageText: e,
    lines: []
   });
  }
 } catch (e) {
  t.push({
   level: "warn",
   type: "css",
   header: "CSS Parse",
   messageText: e,
   lines: []
  });
 }
}, SKIP_ATTRS = new Set([ "s-id", "c-id" ]), createHydrateBuildId = () => {
 let e = "abcdefghijklmnopqrstuvwxyz", t = "";
 for (;t.length < 8; ) t += e[Math.floor(Math.random() * e.length)], 1 === t.length && (e += "0123456789");
 return t;
};

exports.createWindowFromHtml = createWindowFromHtml;
exports.hydrateDocument = hydrateDocument;
exports.renderToString = renderToString;
exports.serializeDocumentToString = serializeDocumentToString;
