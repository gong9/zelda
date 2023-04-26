{{
  const formatLine = (array) => {
    if(!array || !array.length) return array;
    return array.reduce((text, item) => {
      if(!Array.isArray(item)) {
        text += ','
        return text;
      }
      text += item.join("")
      return text;
    }, "")
  }
}}

start
  = diff

diff
  = header:header 
    fileInfo:fileInfo 
    beforeChangeFileName:changeFileName
    afterChangeFileName:changeFileName 
    changeChunk:changeChunk 
    {
      const change = [];
      let chunk = {}
      if(Array.isArray(changeChunk)) changeChunk.forEach(item => {
        if(item.changeHeader){
          if(Object.keys(chunk).length) change.push(chunk);
          chunk = {
            chunkHeader: item.changeHeader,
            chunkBeforeLine: item.beforeChangeLine.line,
            chunkAfterLine: item.afterChangeLine.line,
          }
        } else {
          const itemCopy = {...item}
          if(options.REMOVE_INDENT && itemCopy.text) itemCopy.text = itemCopy.text.trim()
          if(chunk.content){
            chunk.content.push(itemCopy);
          }
          else chunk.content = [itemCopy];
        }
      })
      if(Object.keys(chunk).length) change.push(chunk);
      return {
        type: 'changed',
        filePath: header,
        hash: fileInfo.hash,
        mode: fileInfo.mode,
        permissions: fileInfo.permissions,
        change
      }
    }



header
  = "diff"i _ "--git"i _ 'a'beforePath:filePath _ 'b'afterPath:filePath LINE_END
  {
    return {
      beforePath,
      afterPath
    }
  }

fileInfo
  = zone:zone _ hash:hash _ mode:mode permissions:permissions LINE_END
  {
    return {
      zone,
      hash,
      mode,
      permissions
    }
  }

zone = hit:[A-Za-z]+ { return hit.join("") }

hash
  = 
    beforeHash:[A-Za-z0-9]+
    ..
    afterHash:[A-Za-z0-9]+
    {
      return {
        beforeHash: beforeHash.join(""),
        afterHash: afterHash.join(""),
      }
    }

mode = hit:([0-9][0-9][0-9]) { return hit.join("") }
permissions = hit:([0-9][0-9][0-9]) { return hit.join("") }

changeFileName
  = type:[-|\+]+ _ filePathChange:filePath LINE_END
  {
    return {
      type: type.join(""),
      filePathChange,
    }
  }

changeChunk
  = hit:(
      line:changeHeader
      / beforeContent:changeBeforeContent
      / afterContent:changeAfterContent
      / changeContext
    )*
    {
      return hit.filter(item => item)
    }

changeHeader
  = "@@" _ beforeChangeLine:changeLineInfo _ afterChangeLine:changeLineInfo _ "@@" LINE_END
  {
    return {
      changeHeader: `@@ ${beforeChangeLine.text} ${afterChangeLine.text} @@`,
      beforeChangeLine,
      afterChangeLine
    }
  }

changeLineInfo
  = type:([-|+]) line:([0-9]+","[0-9]+)
  {
    const lineFormatText = formatLine(line);
    return {
      text: `${type}${lineFormatText}`,
      type,
      line: lineFormatText
    }
  }

changeContext = (SPACE / .) {
  return null
}

changeBeforeContent = LINE_END "-" hit:[^\r\n]+ {
  return {
    type: "-",
    text: hit.join("")
  }
}

changeAfterContent = LINE_END "+" hit:[^\r\n]+ {
  return {
    type: "+",
    text: hit.join("")
  }
}

filePath = hit:[A-Za-z0-9\\\/\._\-@$()*&^+!]+ { return hit.join("") }

LINE_END = "\r\n" / "\n"

__ = SPACE* { return "" }
_ = SPACE+ { return "" }
SPACE = " " / "\t"