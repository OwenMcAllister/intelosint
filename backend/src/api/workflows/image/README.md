# Image Handling Protocol

1. Metadata gets checked and goes through classifier agent (Pulls out geotagging, urls, etc)
2. Goes through an image classifer that isolates different parts of the image (Faces, Text, buildings, etc)
3. Faces that are visible get sent to face check id
4. Text gets processed and sent to classifier agent
 - If the text is an address we go through the address protocol, if the text is a company name we go through that protoco, etc
5. Image and isolated Image components get reverse image searched to try and identify as much information as possible
6. All of this output is sent to the parsing agent which sorts through the information and presents it nicely