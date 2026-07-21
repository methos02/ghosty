const MIN_PROPERTIES = 3
const LAST_INDEX = -1

const isOnSameLine = (before, after) => before.loc.end.line === after.loc.start.line

const separatorAfter = (property, sourceCode) => {
  const nextToken = sourceCode.getTokenAfter(property)
  return nextToken.value === ',' ? nextToken : property
}

const inlineGaps = (node, sourceCode) => {
  const openingBrace = sourceCode.getFirstToken(node)
  const closingBrace = sourceCode.getLastToken(node)
  const [firstProperty] = node.properties
  const lastProperty = node.properties.at(LAST_INDEX)
  const gaps = []

  if (isOnSameLine(openingBrace, firstProperty)) {
    gaps.push([openingBrace.range[1], firstProperty.range[0]])
  }

  for (const [index, property] of node.properties.slice(1).entries()) {
    const previousProperty = node.properties[index]

    if (isOnSameLine(previousProperty, property)) {
      gaps.push([separatorAfter(previousProperty, sourceCode).range[1], property.range[0]])
    }
  }

  if (isOnSameLine(lastProperty, closingBrace)) {
    gaps.push([separatorAfter(lastProperty, sourceCode).range[1], closingBrace.range[0]])
  }

  return gaps
}

const create = context => {
  const sourceCode = context.sourceCode

  return {
    ObjectExpression(node) {
      if (node.properties.length < MIN_PROPERTIES) {
        return
      }

      const gaps = inlineGaps(node, sourceCode)

      if (gaps.length === 0) {
        return
      }

      const hasComments = sourceCode.getCommentsInside(node).length > 0

      context.report({
        node,
        messageId: 'multiline',
        data: { count: node.properties.length },
        fix: hasComments ? undefined : fixer => gaps.map(gap => fixer.replaceTextRange(gap, '\n')),
      })
    },
  }
}

export default {
  meta: {
    type: 'layout',
    docs: {
      description:
        'Require an object literal of 3 or more properties to break one property per line, so every item stays visible on a narrow screen.',
      url: 'memory-bank/rules/global/multiline-object-literal.md',
    },
    fixable: 'whitespace',
    schema: [],
    messages: {
      multiline:
        'Object literal of {{count}} properties must break one property per line (see multiline-object-literal).',
    },
  },
  create,
}
