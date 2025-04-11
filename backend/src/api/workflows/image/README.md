# Image Handling Protocol

Images are expected to originate from a URL

1. Metadata gets extracted
2. Goes through an image classifer that isolates faces and text
3. Faces that are visible get sent to face check id
4. Text, facecheckID output, and Metadata are returned to get parsed


# Metadata_extractor

Temp image file is created locally and then deleted to run exif operations on

Per exifread docs: Returned tags will be a dictionary mapping names of Exif tags to their values in the file 

extract_metadata returns a list of strings (tag dict contents) for consistency.