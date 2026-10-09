# Riel Fit Lab
A dependency free phone browser app for calibrated, manually annotated body measurement estimates. This is working prototype code, not a validated automatic body scanner.

## Run
From this directory run `python3 -m http.server 8000`, then open http://localhost:8000 on the same computer. For a phone, serve these files with HTTPS on a host accessible to the phone. An ordinary http://192.168... LAN URL will not enable live camera access. No installation, account, API key or external model download is needed.

## Files
- index.html: responsive capture and annotation interface
- app.mjs: camera lifecycle, per-view photo annotation, unit conversion, export and memory cleanup
- engine.mjs: calibration, cross-section checks and measurement calculations
- engine.test.mjs: run with `node --test engine.test.mjs`

## Workflow
Read the on-screen setup. Capture a front photo with a measured vertical reference in the body plane. Enter its actual length. Tap the requested 18 landmarks in order. Capture a side photo and mark its 8 landmarks, including a separately calibrated reference. Use Edit point to replace a landmark. Calculate and export. Uploading images is also supported. No image leaves the device; exports contain only measurements and calibration factors. Photos and results are not persisted. The camera stops after capture, when switching views, when the page becomes hidden and on reset.

## Definitions and geometry
Bust, waist and hip use front width and side depth at matching anatomical levels. Their perimeter is approximated by Ramanujan's ellipse formula. This does not reconstruct an actual body cross section. Each view has its own scale: measured reference length divided by reference pixel length. All lengths use Euclidean distances in the front photograph times its scale.

Skirt: side waist to selected skirt hem. Trouser: side waist to selected trouser hem (outseam). Shoulder to shoulder: shoulder tip to shoulder tip. Other shoulder lengths start at the shoulder neck point; bust point means the apex. Shoulder to waist ends at the waist below that apex. These are projected straight distances, not surface tape paths; do not treat them as equivalent tailoring measurements. No ease or seam allowances are added.

## Accuracy and next engineering step
There is no established centimetre error bound or calibrated confidence score. A decimal display is numerical formatting, not proof of precision. Checks only reject incomplete landmarks, short or tilted references, non-horizontal cross-section edges and implausible dimensions. They cannot detect all camera tilt, distortion, subject rotation, wrong landmarks or perspective errors. Close fitting clothing is required; do not request undressed photos.

For production-grade precise measurements, replace the projection engine with a validated multi-view body surface reconstruction or suitable depth capture pipeline. Define a single tailoring measurement protocol, including tape surface paths and anatomical landmarks. Collect paired camera and trained tape measurements with informed consent, covering body shapes, skin tones, devices, lighting and clothing conditions. Evaluate each measurement on held-out participants: bias, MAE, repeatability and agreement limits. Reject unsupported capture conditions instead of promising sub-centimetre accuracy. Ordinary pose skeleton landmarks alone do not locate bust apex, waist or circumference accurately. Automated detection would require an additional trained/validated model; none is hidden or stubbed in this code.

## Verification
Four automated geometry tests pass. Physical phone camera behaviour and accuracy against tape have not been tested in this environment. Browser camera implementation reference: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
