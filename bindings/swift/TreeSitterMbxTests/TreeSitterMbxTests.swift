import XCTest
import SwiftTreeSitter
import TreeSitterMbx

final class TreeSitterMbxTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_mbx())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Mbx grammar")
    }
}
