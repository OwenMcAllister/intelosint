# Image Handling Protocol

Images are expected to originate from a URL

1. Metadata gets extracted
2. Goes through an image classifer that isolates faces and text
3. Faces that are visible get sent to face check id
4. Entire image goes through SerpAI Google scraper API
5. Text, facecheckID output, reverse image search output and Metadata are returned to get parsed


# Metadata_extractor

Temp image file is created locally and then deleted to run exif operations on

Per exifread docs: Returned tags will be a dictionary mapping names of Exif tags to their values in the file 

extract_metadata returns a list of strings (tag dict contents) for consistency.


# Face seach

Facial recognition library to find faces in an image

Cropped faces get sent to FaceCheckID (Code from template on FaceCheck website)

FaceCheckID results are returned as a list of strings


# Reverse imae search
Synchronous SerpAI call put in a new thread to avoid concurrency issues
Returns list of links w matching images 
(We may want to return more here to get more out of a single API call)