// Lift the people out of a photograph.
//
//   swift scripts/cutout.swift in.jpg out.png [--pad 24]
//
// Uses Vision's foreground-instance segmentation — the same subject-lift
// that Photos does on long-press — so a cutout is a real alpha matte cut
// around hair and fingers, not a photo behind a shaped mask. Nothing to
// install: it is in the OS.
//
// WHY A CUTOUT AND NOT A CROP. A rectangle of photograph dropped on a page
// is a picture ON the layout; a figure with no background is a piece OF it,
// standing in front of the grid, breaking the trim, casting a shadow on the
// paper. That is the whole difference between a stock photo and a collage,
// and it is the reason the wide strip that used to sit under the calendar
// never worked no matter how it was graded.
//
// Exits 3 with NO_SUBJECT when Vision finds nobody — a silent empty PNG is
// how you end up shipping a hole in the layout.
import CoreImage
import Foundation
import ImageIO
import Vision

let args = CommandLine.arguments
guard args.count >= 3 else {
  FileHandle.standardError.write("usage: cutout <in> <out.png> [--pad N]\n".data(using: .utf8)!)
  exit(2)
}
let inURL = URL(fileURLWithPath: args[1])
let outURL = URL(fileURLWithPath: args[2])
var pad: CGFloat = 0
if let i = args.firstIndex(of: "--pad"), i + 1 < args.count { pad = CGFloat(Double(args[i + 1]) ?? 0) }

guard let src = CGImageSourceCreateWithURL(inURL as CFURL, nil),
      let cg = CGImageSourceCreateImageAtIndex(src, 0, nil) else {
  FileHandle.standardError.write("READ_FAILED \(inURL.lastPathComponent)\n".data(using: .utf8)!)
  exit(4)
}

let handler = VNImageRequestHandler(cgImage: cg, options: [:])
let req = VNGenerateForegroundInstanceMaskRequest()
do { try handler.perform([req]) } catch {
  FileHandle.standardError.write("VISION_FAILED \(error)\n".data(using: .utf8)!)
  exit(5)
}
guard let obs = req.results?.first, !obs.allInstances.isEmpty else {
  FileHandle.standardError.write("NO_SUBJECT \(inURL.lastPathComponent)\n".data(using: .utf8)!)
  exit(3)
}

// Every instance, not just the most prominent one: these frames are pairs
// and groups, and lifting one friend out of a photograph of two is worse
// than lifting neither.
let buf: CVPixelBuffer
do {
  buf = try obs.generateMaskedImage(
    ofInstances: obs.allInstances, from: handler, croppedToInstancesExtent: true)
} catch {
  FileHandle.standardError.write("MASK_FAILED \(error)\n".data(using: .utf8)!)
  exit(6)
}

var ci = CIImage(cvPixelBuffer: buf)
if pad > 0 {
  // Transparent margin so a later stroke/shadow has somewhere to live
  // instead of being clipped flat against the bitmap edge.
  ci = ci.transformed(by: CGAffineTransform(translationX: pad, y: pad))
  let e = ci.extent.insetBy(dx: -pad, dy: -pad)
  ci = ci.cropped(to: CGRect(x: 0, y: 0, width: e.width, height: e.height))
}

let ctx = CIContext(options: [.workingColorSpace: CGColorSpaceCreateDeviceRGB()])
do {
  try ctx.writePNGRepresentation(
    of: ci, to: outURL, format: .RGBA8, colorSpace: CGColorSpaceCreateDeviceRGB())
} catch {
  FileHandle.standardError.write("WRITE_FAILED \(error)\n".data(using: .utf8)!)
  exit(7)
}
print("\(outURL.lastPathComponent) \(Int(ci.extent.width))x\(Int(ci.extent.height)) instances=\(obs.allInstances.count)")
